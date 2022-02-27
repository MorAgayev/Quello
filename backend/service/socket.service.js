const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null

function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: "*",
        }
    });
    gIo.on('connection', socket => {
        const id = socket.id;
        logger.info(`New socket (${id}) connected`);
        socket.listenTo = [];
        socket.on('disconnect', socket => logger.info(`socket (${id}) has been disconnected`));
        socket.on('user', (user) => socket.userId = user?._id);
        // set on listen to events
        socket.on('joinTo', function (ev) {
            if (!socket.listenTo.includes(ev)) {
                socket.listenTo.push(ev);
                socket.join(ev);
                logger.debug(`socket: ${socket.id}`, `join: ${ev}`, `events: [${socket.listenTo}]`);
            }
        });
        // set off listen to events
        socket.on('leaveFrom', function (ev) {
            const idx = socket.listenTo.findIndex(evListen => evListen === ev);
            if (idx > -1) {
                socket.listenTo.splice(idx, 1);
                socket.leave(ev);
                logger.debug(`socket: ${socket.id}`, `leave: ${ev}`, `${(socket.listenTo.length) ? `events: [${socket.listenTo}]` : 'no event to listen.'}`);
            }
        });
    });
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label).emit(type, data);
    else gIo.emit(type, data);
}

async function emitToUser({ type, data, userId }) {
    logger.debug('Emiting to user socket: ' + userId);
    const socket = await _getUserSocket(userId);
    if (socket) socket.emit(type, data);
    else {
        console.log('User socket not found');
        _printSockets();
    }
}

async function broadcast({ type, data, user }) {
    logger.info('BROADCASTING', JSON.stringify(arguments));
    const excludedSocket = await _getUserSocket(user._id);
    logger.debug('broadcast to all');
    excludedSocket.broadcast.emit(type, data);
}

// Send to all sockets BUT not the current socket 
async function broadcast({ type, data, room = null, userId }) {
    logger.info('BROADCASTING', JSON.stringify(arguments));
    const excludedSocket = await _getUserSocket(userId);
    if (!excludedSocket) {
        logger.debug('Socket not found')
        _printSockets();
        return;
    }
    logger.debug(`broadcast to all${(userId) ? ', except: ' + userId : ''}`);
    if (room) excludedSocket.broadcast.to(room).emit(type, data);
    else excludedSocket.broadcast.emit(type, data);
}

async function _getUserSocket(userId) {
    const sockets = await _getAllSockets();
    const socket = sockets.find(s => s.id === userId)
    return socket;
}

function _getAllSockets() {
    const socketIds = Object.keys(gIo.sockets.sockets)
    const sockets = socketIds.map(socketId => gIo.sockets.sockets[socketId])
    return sockets;
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}

function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}

module.exports = {
    connectSockets,
    emitTo,
    emitToUser,
    broadcast,
}