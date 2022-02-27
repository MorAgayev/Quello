import { utilService } from './util.service';
import { httpService } from './http.service';
import { socketService } from './socket.service';
import { getLoggedinUser } from "./user.service";

const OFFLINE_KEY = 'offline';
const PENDING_KEY = 'pending';

var gOffline = utilService.loadFromStorage(OFFLINE_KEY) || [];
var gPending = utilService.loadFromStorage(PENDING_KEY) || {};

socketService.setup();

socketService.on('connect', function () {
    for (const key in gPending) {
        const value = gPending[key];
        delete gPending[key];
        const { type } = value;
        const { url, id, item, queries } = value.data;
        switch (type) {
            case 'DELETE':
                serverService.delete(url, id, queries);
                break;
            case 'PUT':
                serverService.put(url, item, queries);
                break;
            case 'POST':
                serverService.delete(url, item, queries);
                break;
        }
    }
    gOffline = [];
    utilService.saveToStorage(OFFLINE_KEY, gOffline);
    utilService.saveToStorage(PENDING_KEY, gPending);
    // testing join/leave listen events
    // socketService.join('DATA');
    // setTimeout(() => socketService.leave('DATA'), 2500);
});

export const serverService = {
    async get(url, queries) {
        queries = { userId: getLoggedinUser()?._id, ...queries };
        _makeId(url, queries);
        const resCache = _getFromCache(_makeId(url, queries), gOffline);
        if (!socketService.isConnected() && resCache) return resCache.data;
        const res = await httpService.get(url, queries);
        _saveToCache({ id: _makeId(url, queries), timestamp: Date.now(), data: res }, gOffline);
        return res;
    },
    async delete(url, item, queries) {
        queries = { userId: getLoggedinUser()?._id, ...queries };
        if (!socketService.isConnected()) {
            gPending[Date.now()] = { type: 'DELETE', data: { url, item, queries } };
            utilService.saveToStorage(PENDING_KEY, gPending);
        }
        return httpService.delete(url, item, queries);
    },
    async put(url, item, queries) {
        queries = { userId: getLoggedinUser()?._id, ...queries };
        if (!socketService.isConnected()) {
            gPending[Date.now()] = { type: 'PUT', data: { url, queries } };
            utilService.saveToStorage(PENDING_KEY, gPending);
        }
        return httpService.put(url, item, queries);
        socketService.emit('PUT', { data, queries });
    },
    async post(url, item, queries) {
        queries = { userId: getLoggedinUser()?._id, ...queries };
        if (!socketService.isConnected()) {
            gPending[Date.now()] = { type: 'POST', data: { url, item, queries } };
            utilService.saveToStorage(PENDING_KEY, gPending);
        }
        return httpService.post(url, item, queries);
        socketService.emit('POST', { data, queries });
    }
}

function _getFromCache(id, store) {
    const idx = store.findIndex(item => item.id === encodeURIComponent(id));
    return (idx > -1) ? store[idx] : null;
}

function _saveToCache(data, store = gOffline) {
    const idx = store.findIndex(item => item.id === data.id);
    if (idx > -1) { store[idx] = data } else { store.push(data) };
    utilService.saveToStorage(OFFLINE_KEY, store);
}

function _makeId(...args) {
    var id = '';
    args.forEach(arg => { if (arg) id += encodeURIComponent(JSON.stringify(arg)) });
    return id;
}
