import { makeId } from '../service/util.service';
import { userService } from './user.service';

export const cardService = {
    createList,
    createCard,
    addAttachment,
    addCheckList,
    addCheckListItem,
    addLocation,
    setImg,
    setCover,
    createActivity,
    getMentions,
    getCardById,
}

function getCardById(board, listId, cardId) {
    const list = board.lists.find(item => item.id === listId);
    const card = list.cards.find(el => el.id === cardId);
    return card
};

function createList() {
    return {
        title: '',
        cards: [],
        style: {}
    }
}

function createCard() {
    return {
        createdAt: Date.now(),
        createdBy: userService.getLoggedinUser(),
        title: '',
        desc: '',
        members: [],
        labelsIds: [],
        checkList: [],
        dueDate: {
            date: null,
            isComplete: null,
            createdAt: null,
            completedAt: null,
        },
        attachments: [],
        location: null,
        canvas: [],
        cover: {
            color: '',
            size: '',
            imgs: [],
            imgId: '',
        },
        archiveAt: 0,
    }
}

function createActivity(type = '', key = null, title = null, listId = '', cardId = '', mentions = [], dispatch, activityId) {
    const text = {
        dueDate: 'due date',
        todo: 'todo',
        attachments: 'attachment',
        archiveAt: 'archive tag',
        desc: 'description',
        labelsIds: 'labels',
        style: 'background',
    }
    if (key) title += ` ${text[key] || key.toLowerCase()}`;
    else if (dispatch) title += ` '${dispatch.item?.title || dispatch.card?.title || dispatch.list?.title}'`;
    return {
        id: activityId || null,
        createdAt: Date.now(),
        createdBy: userService.getLoggedinUser(),
        type,
        title,
        cardId,
        listId,
        mentions,
        dispatch,
    }
}

function getMentions(board, listId, cardId) {
    if (cardId)
        return board.lists
            .find((list) =>
                list.cards.find((card) => card.id === cardId)
            )?.cards.find((card) => card.id === cardId)?.members || [];
    else if (listId) {
        const mentions = board.lists.find(list => list.id === listId)?.cards.map(card => card.members).reduce((acc, val) => acc.concat(val), []) || [];
        return mentions.filter((fmention, idx) => mentions.findIndex(mention => mention._id === fmention._id) === idx);
    } else board.members || [];
}

function setCover(color = null, size = 'contain', imgId = null) {
    return {
        color,
        size,
        imgs: [],
        imgId
    }
}

function setImg(url = null) {
    return {
        id: makeId(),
        url,
    }
}

function addCheckList(title) {
    return {
        title,
        items: []
    }
}

function addCheckListItem(title, members = []) {
    return {
        title,
        isDone: false,
        dueDate: {
            completedAt: null,
            createAt: null,
            date: null,
        },
        members
    }
}

function addAttachment(url, fileName, type, suffix) {
    return {
        createdAt: Date.now(),
        url,
        fileName,
        type,
        suffix
    }
}

function addLocation(address) {
    return {
        address,
        lat: '',
        lng: '',
        title: '',
        api: '',
    }
}
