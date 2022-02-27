import io from 'socket.io-client'
const SOCKET_URL = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030';

import { getLoggedinUser } from '../service/user.service'

export const SOCKET_EMIT = {
  USER_WATCH: 'user-watch',
}

export const SOCKET_EVENT = {
  USER_UPDATED: 'user-updated',
}

export const socketService = createSocketService(SOCKET_URL);

window.socketService = socketService;
socketService.setup();

function createSocketService(url) {
  var evListeners = [];
  var socket = null;
  return {
    async setup(user = getLoggedinUser()) {
      socket = io(url, {
        'reconnection': true,
        'reconnectionDelay': 1000,
        'reconnectionDelayMax': 5000,
      });
      if (user) {
        this.join(user._id)
        this.emit('user', user);
      }
      evListeners.forEach(({ eventName, cb }) => socket.on(eventName, cb));
    },
    on(eventName, cb) {
      if (!socket && !evListeners.find(ev => ev.eventName === eventName && ev.cb === cb)) evListeners.push({ eventName, cb });
      else socket.on(eventName, cb);
    },
    off(eventName, cb = null) {
      evListeners = evListeners.filter(ev => { return !(ev.eventName === eventName && (!cb || ev.cb === cb)) });
      if (!socket) return;
      if (!cb) socket.removeAllListeners(eventName);
      else socket.off(eventName, cb);
    },
    emit(eventName, data) {
      if (!socket) {
        console.error('web socket not connection');
        return;
      } else socket.emit(eventName, data);
    },
    join(ev) {
      if (!socket) {
        console.error('web socket not connection');
        return;
      } else socket.emit('joinTo', ev);
    },
    leave(ev) {
      if (!socket) {
        console.error('web socket not connection');
        return;
      } else socket.emit('leaveFrom', ev);
    },
    terminate() {
      socket.disconnect();
      socket = null;
    },
    status() {
      return socket;
    },
    isConnected() {
      return (socket) ? socket.connected : false;
    },
  }
}

// socketService.emit('kuku', 'DATA');
// socketService.off('kuku', cbTest)

// setTimeout(function () {
//   socketService.off('kuku', cbTest);
// }, 20000);

