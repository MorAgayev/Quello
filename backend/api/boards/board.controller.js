const boardService = require('./board.service.js');
const logger = require('../../service/logger.service');

module.exports = {
    requirePremission: premission,
    getAll: query,
    getById: get,
    addBoard: add,
    updateBoard: update,
    removeBoard: remove,
    sortBoard: sort,
    setActivity,
    setList,
    setCard,
    setItem,
    removeActivity,
    removeList,
    removeCard,
    removeItem,
}

// MIDDLEWARE CHECK FOR PREMISSION
async function premission(req, res, next) {
    // next();
    // return;
    const id = req.params.id || req.body._id || req.query.boardId;
    const { user } = req.session;
    if (!user) {
        res.status(401).end('Unauthorized!');
        return;
    }
    const board = await boardService.premission(id, user._id);
    if (!board) {
        res.status(403).end('Unauthorized!');
        return
    } else
        next();
}

// GET LIST
async function query(req, res) {
    try {
        var { query } = req;
        const send = await boardService.query({ user: req.session.user, ...query });
        res.json(send);
    } catch (err) {
        logger.error('Failed to get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

// GET BY ID 
async function get(req, res) {
    try {
        const { id } = req.params;
        res.json(await boardService.get({ user: req.session.user, _id: id }));
    } catch (err) {
        logger.error('Failed to get board', err);
        res.status(500).send({ err: 'Failed to get board' });
    }
}

// POST
async function add(req, res) {
    try {
        const { session, body } = req;
        const { user } = session;
        res.json(await boardService.add(body, user));
    } catch (err) {
        logger.error('Failed to add board', err);
        res.status(500).send({ err: 'Failed to add board' });
    }
}

// PUT
async function update(req, res) {
    try {
        const { session, query, params, body } = req;
        const { id } = params;
        const { key, userId } = query;
        const { user } = session;
        const ret = await boardService.update(userId, body, id, key, user);
        res.json(ret)
    } catch (err) {
        logger.error('Failed to update board', err);
        res.status(500).send({ err: 'Failed to update board' });
    }
}

// SET ACTIVITY
async function setActivity(req, res) {
    try {
        const { boardId } = req.query;
        const activiy = req.body;
        res.json(await boardService.setActivity(activiy, boardId));
    } catch (err) {
        logger.error('Failed to add activity', err);
        res.status(500).send({ err: 'Failed to add activity' });
    }
}

// SET LIST (ADD/EDIT)
async function setList(req, res) {
    try {
        const { session, query, body } = req;
        const { userId, boardId } = query;
        const { user } = session;
        const ret = await boardService.setList(userId, boardId, body, user);
        res.json(ret)
    } catch (err) {
        logger.error('Failed to update board list', err);
        res.status(500).send({ err: 'Failed to update board list' });
    }
}

// SET CARD (ADD/EDIT)
async function setCard(req, res) {
    try {
        const { session, query, body } = req;
        const { userId, boardId, listId } = query;
        const { user } = session;
        const ret = await boardService.setCard(userId, boardId, listId, body, user);
        res.json(ret)
    } catch (err) {
        logger.error('Failed to update board', err);
        res.status(500).send({ err: 'Failed to update board' });
    }
}

// SET ITEM (ADD/EDIT)
async function setItem(req, res) {
    try {
        const { session, query, body } = req;
        const { userId, boardId, listId, cardId } = query;
        const { user } = session;
        const ret = await boardService.setItem(userId, boardId, listId, cardId, body, user);
        res.json(ret)
    } catch (err) {
        logger.error('Failed to update board', err);
        res.status(500).send({ err: 'Failed to update board' });
    }
}

// DELETE
async function remove(req, res) {
    try {
        const boardId = req.params.id;
        // else ret = await boardService.remove(boardId);
        res.send(ret);
    } catch (err) {
        logger.error('Failed to remove board', err);
        res.status(500).send({ err: 'Failed to remove board' });
    }
}

// SORT
async function sort(req, res) {
    try {
        const boardId = req.params.id;
        const userId = req.params.query
        const sortMap = req.body;
        const ret = await boardService.sort(userId, boardId, sortMap);
        res.json(ret);
    } catch (err) {
        logger.error('sorting board has been failed', err);
        res.status(500).send({ err: 'sorting board has been failed' });
    }
}

async function removeActivity(req, res) {
    try {
        const ret = await boardService.removeActivity(req.body);
        res.send(ret);
    } catch (err) {
        logger.error('Failed to remove activity', err);
        res.status(500).send({ err: 'Failed to remove activity' });
    }
}
async function removeList(req, res) {
    try {
        const { session, query, body } = req;
        const { userId, boardId } = query;
        const { user } = session;
        const ret = await boardService.removeList(userId, boardId, body, user);
        res.json(ret);
    } catch (err) {
        logger.error('Failed to remove board', err);
        res.status(500).send({ err: 'Failed to remove board' });
    }
}

async function removeCard(req, res) {
    try {
        const { session, query, body } = req;
        const { userId, boardId, listId } = query;
        const { user } = session;
        const ret = await boardService.removeCard(userId, boardId, listId, body, user);
        res.json(ret);
    } catch (err) {
        logger.error('Failed to remove board', err);
        res.status(500).send({ err: 'Failed to remove board' });
    }
}

async function removeItem(req, res) {
    try {
        const { session, query, body } = req;
        const { userId, boardId, listId, cardId } = query;
        const { user } = session;
        const ret = await boardService.removeItem(userId, boardId, listId, cardId, body, user);
        res.json(ret);
    } catch (err) {
        logger.error('Failed to remove board', err);
        res.status(500).send({ err: 'Failed to remove board' });
    }
}
