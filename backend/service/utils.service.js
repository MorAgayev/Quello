module.exports = {
    debounce,
    deepCopy,
    sortByIds,
    makeId,
    typeOf
};

const DEBOUNCES = {};
function debounce(fn, id = 0, delay = 500) {
    clearTimeout(DEBOUNCES[id]);
    DEBOUNCES[id] = null;
    return ((...args) => {
        DEBOUNCES[id] = setTimeout(() => {
            delete DEBOUNCES[id];
            fn(...args);
        }, delay);
    })();
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
};

function sortByIds(arr, ids, key = 'id') {
    return arr.sort((val1, val2) => {
        return ids.indexOf(val1[key]) - ids.indexOf(val2[key])
    })
};

function makeId(length = 8) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function typeOf(obj) {
    return /[\s-]\w+(|\])/.exec(Object.prototype.toString.call(obj))[0].trim();
}
