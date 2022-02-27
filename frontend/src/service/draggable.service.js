
import { deepCopy } from "./util.service";

export const applyDrag = (arr, dragResult, listId, payloaded) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;
  const res = {
    children: [...arr],
    change: payloaded || {
      ids: [],
    },
  }
  let itemToAdd = payload;
  if (listId === null) res.change = { list: deepCopy(arr[removedIndex]), from: removedIndex, to: addedIndex, ids: [] };
  else if (arr[removedIndex] || arr[addedIndex]) res.change.item = deepCopy((arr[removedIndex]) ? arr[removedIndex] : arr[addedIndex]);
  if (removedIndex !== null) {
    res.change.from ??= { list: listId, index: removedIndex };
    itemToAdd = res.children.splice(removedIndex, 1)[0];
  }
  if (addedIndex !== null) {
    res.change.to ??= { list: listId, index: addedIndex };
    res.children.splice(addedIndex, 0, itemToAdd);
  }
  res.children.forEach(el => res.change.ids.push(el.id));
  return res;
}

export function createDragMap(arr, obj) {
  var map = {
    type: "container",
    props: {
      orientation: "horizontal",
    },
    children: [],
  };
  arr.forEach((element1) => {
    map.children.push({
      children: [],
      id: element1.id,
      name: element1.title,
      data: element1,
      props: {
        className: "card-container",
        orientation: "vertical",
      },
      type: "container",
    });
    element1[obj].forEach((element2) => {
      map.children[map.children.length - 1].children.push({
        data: element2,
        id: element2.id,
        props: {
          className: "card",
        },
        type: "draggable",
      });
    });
  });
  return map;
}

export function sortMap(arr) {
  var map = {};
  arr.children.forEach(list => {
    map[list.id] = [];
    list.children.forEach(card => map[list.id].push(card.id));
  });
  return map;
}