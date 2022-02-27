export const socketService = createDummySocketService();

window.socketService = socketService;

function createDummySocketService() {
    var listenersMap = {};
    const socketService = {
        listenersMap,
        setup() {
            listenersMap = {};
            // window.mapmap = listenersMap;
        },
        terminate() {
            this.setup();
        },
        on(eventName, cb) {
            listenersMap[eventName] = [...(listenersMap[eventName] || []), cb];
        },
        off(eventName, cb) {
            if (!listenersMap[eventName]) return;
            if (!cb) delete listenersMap[eventName];
            else listenersMap[eventName] = listenersMap[eventName].filter(l => l !== cb);
        },
        emit(eventName, data) {
            if (!listenersMap[eventName]) return;
            listenersMap[eventName].forEach(listener => {
                listener(data);
            })
        },
        debugMsg() {
            this.emit('chat addMsg', { from: 'Someone', txt: 'Aha it worked!' });
        },
    }
    return socketService;
}