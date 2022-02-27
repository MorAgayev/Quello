import { serverService } from './server.service';
import { debounce, typeOf } from './util.service';

export const boardService = {
  query,
  getBoardById,
  remove,
  add,
  update,
  sort,
  setBoard,
  setList,
  setCard,
  setItem,
  setActivity,
  removeList,
  removeCard,
  removeItem,
  removeActivity,
}

const API = 'board/'

async function query(filter = {}) {
  return serverService.get(API, { params: filter })
}

async function getBoardById(id) {
  return serverService.get(API + id)
}

async function remove(id) {
  return serverService.delete(API + id)
}

async function add(title, style) {
  return serverService.post(API, { title, style })
}

async function update(board) {
  return serverService.put(API + board._id, board)
}

async function sort(map, id) {
  return serverService.put(API + 'sort/' + id, map)
}

async function setBoard(item, key, id) {
  return serverService.put(API + id, { item }, { key });
}

async function setList(list, query) {
  return serverService.put(API + '/list', list, query);
}

async function setCard(card, query) {
  return serverService.put(API + '/card', card, query);
}

async function setItem(item, query) {
  return serverService.put(API + '/item', item, query);
}

async function setActivity(activity, query) {
  if (activity.id) return serverService.put(API, activity, query);
  else return serverService.post(API + '/activity', activity, query);
}

async function removeList(list, query) {
  const ret = serverService.delete(API + '/list', list, { ...query, listId: list.id });
  return ret;
}

async function removeCard(card, query) {
  return serverService.delete(API + '/card', card, { ...query, cardId: card.id });
}

async function removeItem(item, query) {
  return serverService.delete(API + '/item', item, query);
}

async function removeActivity(activity, query) {
  return serverService.delete(API + '/activity', activity, query);
}
