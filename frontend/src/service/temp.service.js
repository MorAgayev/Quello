
import { utilService } from "./util.service.js";

export function createDemoMembers() {
    var users = utilService.loadFromStorage('users') || [];
    if (!users.length) ['Puki', 'Muki', 'Shuki', 'Kuku', 'Duko'].forEach(username => users.push(createMemeber(username, username, '')));
    utilService.saveToStorage('users', users);
    return users;
}

function createMemeber(fullname, username, imgUrl) {
    return {
        _id: utilService.makeId(),
        fullname,
        username,
        imgUrl,
        mentions: [],
        notifications: [],
    }
}

function createDndSmoothMap(arr, obj) {
    var map = {
        type: 'container',
        props: {
            orientation: "horizontal",
        },
        children: []
    }
    arr.forEach(element1 => {
        map.children.push({
            children: [],
            id: element1.id,
            name: element1.title,
            props: {
                className: "card-container",
                orientation: "vertical"
            },
            type: "container",
        });
        element1[obj].forEach(element2 => {
            map.children[map.children.length - 1].children.push({
                data: element2,
                id: element2.id,
                props: {
                    className: "card"
                },
                type: "draggable",
            });
        });
    });
    return map;
}