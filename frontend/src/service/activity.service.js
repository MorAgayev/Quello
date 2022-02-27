import { serverService } from './server.service';

export const activityService = {
  query,
  remove,
  add,
  update,
}

const API = 'board/activity'

async function query() {
  return serverService.get(API + '/')
}

async function remove(boardId, activity) {
  return serverService.delete(API, activity, { boardId })
}

async function add(board, activity) {
  return serverService.post(API, activity, { boardId: board._id })
}

async function update(board, activity) {
  return serverService.put(API, activity, { boardId: board._id })
}