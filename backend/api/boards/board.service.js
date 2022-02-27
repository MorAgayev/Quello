const dbService = require('../../service/db.service');
const logger = require('../../service/logger.service');
const ObjectId = require('mongodb').ObjectId;
const utilService = require('../../service/utils.service');
const socketService = require('../../service/socket.service');

const collectionDb = 'boards';
const demoBoard = {
    '61dea9c1d8fc4e646dcad719': require('../../json/61dea9c1d8fc4e646dcad719.json'),
    '61dea94fd8fc4e646dca56dc': require('../../json/61dea94fd8fc4e646dca56dc.json'),
    '61dea970d8fc4e646dca7b99': require('../../json/61dea970d8fc4e646dca7b99.json'),
    '61deaa7bd8fc4e646dcba9bf': require('../../json/61deaa7bd8fc4e646dcba9bf.json'),
    '61deaafcd8fc4e646dcc361c': require('../../json/61deaafcd8fc4e646dcc361c.json'),
    '61deab97d8fc4e646dcce7db': require('../../json/61deab97d8fc4e646dcce7db.json'),
    '61debc360f00b72a8c131ebd': require('../../json/61debc360f00b72a8c131ebd.json'),
};

module.exports = {
    premission,
    query,
    get,
    add,
    update,
    remove,
    sort,
    setList,
    setCard,
    setItem,
    removeActivity,
    removeList,
    removeCard,
    removeItem,
    setActivity,
}

async function premission(boardId, userId) {
    try {
        const id = new ObjectId(boardId);
        const collection = await dbService.getCollection(collectionDb);
        var board = collection.findOne({ $and: [{ _id: id }, { members: { $elemMatch: { _id: userId } } }] });
        return await board ? true : false;
    } catch (err) {
        console.log(err);
    }
}

async function query(query) {
    try {
        const sort = _buildSortCriteria(query);
        const filter = _buildFilterCriteria(query);
        const collection = await dbService.getCollection(collectionDb);
        const { user } = query;
        // let boards = await collection.find(filter).sort(sort);
        let boards = await collection.aggregate([
            { $match: { 'members._id': user._id } },
            {
                $project: {
                    members: {
                        $filter: {
                            input: '$members',
                            as: 'member',
                            cond: { $eq: ['$$member._id', user._id] }
                        }
                    },
                    _id: 1, title: 1, style: 1, members: 1, activityCount: 1, lastActivity: 1, isFavorite: 1, isDemoBoard: 1
                }
            }
        ]);
        boards = await boards.toArray();
        return boards;
    } catch (err) {
        logger.error(`failed to get boards from '${collectionDb}':`, err);
        throw err
    }
}

async function get(query) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const board = await collection.findOne(ObjectId(query._id));
        board._id = query._id;
        if (board.isDemoBoard && !demoBoard[board._id])
            demoBoard[board._id] = board;
        board.createdAt = ObjectId(board._id).getTimestamp();
        return board;
    } catch (err) {
        logger.error(`failed to get board '${id}' from '${collectionDb}':`, err);
        throw err;
    }
}

async function add({ title, style, board }, user) {
    try {
        board ??= _createBoard(title, style, user);
        const collection = await dbService.getCollection(collectionDb);
        const res = await collection.insertOne(board);
        if (user.username === 'Guest') utilService.debounce(() => remove(res.insertedId), res.insertedId, 1000 * 60 * 30);
        return res.insertedId;
    } catch (err) {
        logger.error('adding failed:', err);
        throw err;
    }
}

async function update(userId, body, boardId, key, user) {
    try {
        const id = ObjectId(boardId);
        const collection = await dbService.getCollection(collectionDb);
        var board;
        if (!key) board = body;
        else {
            const { item } = body;
            board = await collection.findOne(id);
            board[key] = item;
            socketService.emitTo({ type: 'COMMIT', data: { type: 'setBoardItem', userId, boardId, item, key } });
        }
        if (board.isReadonly) throw 'Board is read only';
        delete board._id;
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        board._id = boardId;
        logger.info(`board '${id}' has been updated.`)
        if (key)
            _restoreBoard(boardId);
        return (!key) ? board : body;
    } catch (err) {
        logger.error(`faild to update board '${id}'.`, err);
        throw err;
    }
}

async function remove(id) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        await collection.deleteOne({ '_id': ObjectId(id) });
        logger.info(`board '${id}' has been removed`);
        return id;
    } catch (err) {
        logger.error(`failed to remove board '${id}' from '${collectionDb}':`, err);
        throw err;
    }
}

async function sort(userId, boardId, map) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const id = ObjectId(boardId);
        var board = await collection.findOne(id);
        delete board._id;
        const listIds = [];
        for (const key in map) {
            listIds.push(key);
        }
        var mergedCards = [];
        board.lists.forEach(list => mergedCards = mergedCards.concat(list.cards));
        board.lists = board.lists.map(list => {
            return {
                ...list,
                cards: utilService.sortByIds(mergedCards.filter(card => map[list.id].includes(card.id)), map[list.id]),
            }
        });
        board.lists = utilService.sortByIds(board.lists, listIds);
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        socketService.emitTo({ type: 'COMMIT', data: { type: 'sortBoard', userId, boardId, map } });
        logger.info(`board '${id}' has been sorted.`);
        _restoreBoard(boardId);
        return board.lists;
    } catch (err) {
        console.log(err);
    }
}

async function setActivity(activity, boardId) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const id = ObjectId(boardId);
        const board = await collection.findOne(id);
        if (board.isReadonly) throw 'Board is read only';
        delete board._id;
        const activities = board.activities
        if (activity.id) {
            activityIdx = activities.findIndex(activity => activity.id === activity.id);
            activities.splice(activityIdx, 1, activity);
        } else {
            activity.id = utilService.makeId();
            activities.unshift(activity);
        }
        socketService.emitTo({ type: 'COMMIT', data: { type: 'setActivity', userId: activity.createdBy._id, boardId: board._id, activity } });
        board.activityCount++;
        board.lastActivity = Date.now();
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        board._id = id;
        return activity
    } catch (err) {
        logger.error('adding failed:', err);
        throw err;
    }
}

async function setList(userId, boardId, list, user) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const id = ObjectId(boardId);
        const board = await collection.findOne(id);
        if (board.isReadonly) throw 'Board is read only';
        delete board._id;
        const lists = board.lists;
        if (list.id) {
            const listIdx = lists.findIndex(currList => currList.id === list.id);
            if (listIdx > -1) lists.splice(listIdx, 1, list);
            else lists.push(list);
        } else {
            list.id = utilService.makeId()
            lists.push(list);
        }
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        socketService.emitTo({ type: 'COMMIT', data: { type: 'setList', userId, boardId: id, list } });
        logger.info(`list '${list.id}' has been updated.`);
        _restoreBoard(boardId);
        return list;
    } catch (err) {
        logger.error(`faild to set list '${id}'.`, err);
        throw err;
    }
}

async function setCard(userId, boardId, listId, card, user) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const id = ObjectId(boardId);
        const board = await collection.findOne(id);
        if (board.isReadonly) throw 'Board is read only';
        delete board._id;
        const list = board.lists.find(list => list.cards.find(c => c.id === card.id)) || board.lists.find(el => el.id === listId);
        if (card.id) {
            const cardIdx = list.cards.findIndex(currList => currList.id === card.id);
            if (cardIdx > -1) list.cards.splice(cardIdx, 1, card)
            else list.cards.push(card);
        } else {
            card.id = utilService.makeId();
            list.cards.push(card);
        }
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        socketService.emitTo({ type: 'COMMIT', data: { type: 'setCard', userId, boardId: id, listId, card } });
        logger.info(`card '${card.id}' has been updated.`);
        _restoreBoard(boardId);
        return card;
    } catch (err) {
        logger.error(`faild to set card '${id}'.`, err);
        throw err;
    }
}

async function setItem(userId, boardId, listId, cardId, { key, item }, user) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const id = ObjectId(boardId);
        const board = await collection.findOne(id);
        if (board.isReadonly) throw 'Board is read only';
        delete board._id;
        const list = board.lists.find(list => list.cards.find(card => card.id === cardId)) || board.lists.find(list => list.id === listId);
        // const list = board.lists.find(list => list.id === listId);
        const card = list.cards.find(card => card.id === cardId);
        if (card[key] && utilService.typeOf(card[key]) === 'Array' && utilService.typeOf(item) === 'Object') {
            if (item.id) {
                const itemIdx = card[key].findIndex(currItem => currItem.id === item.id);
                if (itemIdx > -1) card[key].splice(itemIdx, 1, item);
            } else {
                item.id = utilService.makeId()
                card[key].push(item);
            }
        } else card[key] = item;
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        socketService.emitTo({ type: 'COMMIT', data: { type: 'setItem', userId, boardId: id, listId, cardId, item, key } });
        // if (user) socketService.broadcast({ type: 'COMMIT', data: { user, type: 'setItem', boardId: id, listId, cardId, item, key }, user });
        logger.info(`${key} has been updated.`);
        _restoreBoard(boardId);
        return item;
    } catch (err) {
        logger.error(`faild to set item '${id}'.`, err);
        throw err;
    }
}

async function removeActivity({ boardId, activity }) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const id = ObjectId(boardId);
        const board = await collection.findOne(id);
        if (board.isReadonly) throw 'Board is read only';
        delete board._id;
        const activityIdx = board.activities.findIndex(currActivity => currActivity.id === activity.id);
        if (activityIdx > -1) board.activities.splice(activityIdx, 1);
        board.activityCount++;
        board.lastActivity = Date.now();
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        socketService.emitTo({ type: 'COMMIT', data: { type: 'removeActivity', userId: activity.createdBy._id, boardId: boardId, activity } });
        _restoreBoard(boardId);
        return activity;
    } catch (err) {
        logger.error(`faild to remove list '${id}'.`, err);
        throw err;
    }
}

async function removeList(userId, boardId, list, user) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const id = ObjectId(boardId);
        const board = await collection.findOne(id);
        if (board.isReadonly) throw 'Board is read only';
        delete board._id;
        const listIdx = board.lists.findIndex(currList => currList.id === list.id);
        if (listIdx > -1) board.lists.splice(listIdx, 1);
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        socketService.emitTo({ type: 'COMMIT', data: { type: 'removeList', userId, boardId: id, list } });
        logger.info(`list '${list.id}' has been removed.`);
        _restoreBoard(boardId);
        return list;
    } catch (err) {
        logger.error(`faild to remove list '${list.id}'.`, err);
        throw err;
    }
}

async function removeCard(userId, boardId, listId, card, user) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const id = ObjectId(boardId);
        const board = await collection.findOne(id);
        if (board.isReadonly) throw 'Board is read only';
        delete board._id;
        const list = board.lists.find(list => list.cards.find(c => c.id === card.id));
        // const list = board.lists.find(list => list.id === listId);
        const cardIdx = list.cards.findIndex(currCard => currCard.id === card.id);
        if (cardIdx > -1) list.cards.splice(cardIdx, 1);
        board.activities = board.activities.filter(activity => activity.type !== 'item' && activity.cardId !== card.id);
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        socketService.emitTo({ type: 'COMMIT', data: { type: 'removeCard', userId, boardId: id, listId, card } });
        logger.info(`card '${card.id}' has been removed.`);
        _restoreBoard(boardId);
        return card;
    } catch (err) {
        logger.error(`faild to remove card '${card.id}'.`, err);
        throw err;
    }
}

async function removeItem(userId, boardId, listId, cardId, { key, item }, user) {
    try {
        const collection = await dbService.getCollection(collectionDb);
        const id = ObjectId(boardId);
        const board = await collection.findOne(id);
        if (board.isReadonly) throw 'Board is read only';
        delete board._id;
        const list = board.lists.find(list => list.cards.find(card => card.id === cardId));
        // const list = board.lists.find(list => list.id === listId);
        const card = list.cards.find(card => card.id === cardId);
        if (utilService.typeOf(card[key]) === 'Array') {
            const itemIdx = card[key].findIndex(currItem => currItem.id === item.id);
            if (itemIdx > -1) card[key].splice(itemIdx, 1);
        } else card[key] = null;
        await collection.updateOne({ "_id": id }, { $set: { ...board } });
        socketService.emitTo({ type: 'COMMIT', data: { user, type: 'removeItem', userId, boardId: id, listId, cardId, item, key } });
        logger.info(`'${key}' has been removed.`);
        _restoreBoard(boardId);
        return item;
    } catch (err) {
        logger.error(`faild to remove item from '${key}'.`, err);
        throw err;
    }
}

function _resultPage({ page }, count) {
    if (page) {
        page = JSON.parse(page);
        page.index ??= 0;
        page.total = Math.ceil(count / page.size);
    }
    return page;
}

function _buildSortCriteria({ sort }) {
    const criteria = {};
    if (sort) {
        sort = JSON.parse(sort);
        criteria[sort.type] = (sort.descending) ? -1 : 1;
    }
    return criteria;
}

function _buildFilterCriteria({ filter }) {
    const criteria = {};
    if (filter) {
        filter = JSON.parse(filter);
        if (filter.name) criteria.name = { $regex: filter.name, $options: 'i' };
        if (filter.tags?.length) criteria.tags = { $elemMatch: { $regex: `^.*(${filter.tags.join('|')}).*$`, $options: 'i' } }
        if (filter.inStock !== null) criteria.inStock = { inStock: { $eq: filter.inStock } };
    }
    return criteria;
}

function _createBoard(title, style, createdBy) {
    const labels = require("./json/labels.json")
    return {
        title,
        style,
        createdBy,
        members: [createdBy],
        activities: [],
        createdAt: Date.now(),
        labels: labels.map(label => ({ id: utilService.makeId(), ...label })),
        lists: [{
            id: utilService.makeId(),
            title: 'New list',
            cards: [],
            style: {},
        }],
        isReadonly: false,
        isDemoBoard: false,
        activityCount: 0,
        lastActivity: Date.now(),
        isFavorite: false
    }
}

function _restoreBoard(id) {
    if (demoBoard[id]) {
        const board = { ...demoBoard[id], lastActivity: Date.now(), activityCount: demoBoard[id].activities.length };
        utilService.debounce(() => update(null, board, id), id, 1000 * 60 * 10);
    }
}