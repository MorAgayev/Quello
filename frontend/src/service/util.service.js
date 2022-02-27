export const utilService = {
    debounce,
    typeOf,
    sortByIds,
    deepCopy,
    deepClone,
    deepCompare,
    deepCompareArray,
    futureRun,
    randomHexColor,
    saveToStorage,
    loadFromStorage,
    loadFromJSON,
    setMinMax,
    makeId,
    sentenceToKababCase,
    sentenceToCamelCase,
    camelCaseToSentence,
    getDistanceInKm,
    getKeywords,
    createWordsRateMap,
    imageLoader,
    getImgAvgColor,
    getImgDominantColor,
    getBase64FromUrl,
    isHexColorLight,
}

import IGNORE_WORDS from "../assets/json/ignore.words.json"

async function getCurrentPosition() {
    try {
        const geolocation = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(coords => { resolve(coords) }, err => { reject(err) });
        });
        return { lat: geolocation.coords.latitude, lng: geolocation.coords.longitude };
    } catch (err) {
        throw new Error(`can't load location`);
    }
}

export async function getDistanceInKm(location1, location2) {
    location2 ??= await getCurrentPosition();
    if (!location1 || !location2) return;
    const p = Math.PI / 180;
    const r = 6371;
    const cos = Math.cos;
    const a = 0.5 - cos((location2.lat - location1.lat) * p) / 2 +
        cos(location1.lat * p) * cos(location2.lat * p) *
        (1 - cos((location2.lng - location1.lng) * p)) / 2;
    const res = Math.round((2 * r) * Math.asin(Math.sqrt(a)));
    return res;
}

export function createWordsRateMap(str) {
    if (!str) return {};
    const extractKeywords = (str) => {
        const url = `((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[\\w]*))?)`;
        const ignore = `\\b(?<!(${url}|${IGNORE_WORDS.join("|")}))`;
        const pattern = `(\\b(((?:[A-Z]+[\\s|\\-])?[A-Z](\\w+)(\\s|\\.\\w+|)){1,3}(?=\\W))|\\b([a-z]+){3})${ignore}`;
        const re = new RegExp(pattern, "gm");
        return str.match(re) || [];
    }
    const words = extractKeywords(str);
    const totalShows = (val) => words.map(word => word.replace("-", " ")).filter(word => !isIgnoreWord(word) && word === val).length || 1;
    const isIgnoreWord = (keyword) => IGNORE_WORDS.includes(keyword.toLowerCase());
    return words.reduce((sum, value, index, words) => {
        const rate = (acc) => (acc * (words.length / index) ^ (1 / (totalShows(value)))) * (1 + (words.length / index) / words.length);
        const isValid = (keyword) => isNaN(keyword) && keyword.length > 2 && !isIgnoreWord(keyword);
        const setFormat = (value) => value.split(" ").map(word => {
            return word.split("-").map(val => {
                return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
            }).join("-");
        }).filter(word => !isIgnoreWord(word)).join(" ");
        let keyword = setFormat(value);
        if (isValid(keyword)) {
            const key = Object.keys(sum).find(key => (key !== keyword) && (keyword.includes(key) || keyword.replace(" ", "-") === key));
            if (key)
                if (key.split(" ").length < keyword.split(" ").length) {
                    sum[keyword] = sum[key];
                    delete sum[key];
                } else keyword = key;
            sum[keyword] = sum[keyword] ? rate(sum[keyword] + 1) : rate(1);
        }
        return sum;
    }, {});
}

export function getKeywords(str, max = 6) {
    if (!str) return [];
    const sortMapToArray = (obj, isDescending = true) => {
        const arr = Object.keys(obj).map(key => (key));
        return arr.sort((val1, val2) => isDescending ? obj[val2] - obj[val1] : obj[val1] - obj[val2]) || [];
    }
    if (Object.prototype.toString.call(str) === '[object Array]') str = str.join(',');
    const rated = createWordsRateMap(str);
    return sortMapToArray(rated).slice(0, max).filter(word => rated[word] > 1);
}

export function isWordIgnored(word) {
    return IGNORE_WORDS.includes(word.toLowerCase());
}

export function deepClone(value) {
    if (typeOf(value) === "Array" || typeOf(value) === "Object") {
        if (typeOf(value) === "Array") value = [...value];
        if (typeOf(value) === "Object") value = { ...value };
        for (const key in value) {
            value[key] = deepClone(value[key]);
        }
    }
    return value;
}

export function getShortSentence(str, length = 48) {
    if (str.length < length) return str;
    var res = str.substr(0, length);
    res = str.substr(0, Math.min(res.length, res.lastIndexOf(" ")));
    return res + '...';
}

export async function getBase64FromUrl(url) {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
        }
    });
}

export function imageLoader(url) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('load image failed'));
    })
}

export function getImgAvgColor(img, width, height, rangeW, rangeH, startX = 0, startY = 0) {
    width ??= img.width;
    height ??= img.height;
    rangeW ??= width;
    rangeH ??= height;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    const data = ctx.getImageData(startX, startY, rangeW, rangeH).data;
    var i = -4, rgb = { r: 0, g: 0, b: 0 };
    while ((i += 4) < data.length) {
        rgb.r += data[i];
        rgb.g += data[i + 1];
        rgb.b += data[i + 2];
    }
    rgb.r /= data.length / 4;
    rgb.g /= data.length / 4;
    rgb.b /= data.length / 4;
    return rgbToHex(rgb.r, rgb.g, rgb.b);
}

export function getImgDominantColor(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, 1, 1);
    const rgb = ctx.getImageData(0, 0, 1, 1).data;
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

export function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255) return '#000000';
    return '#' + ("000000" + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
}

export function isHexColorLight(color) {
    if (!color) return true;
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 155;
}

export function sentenceToKababCase(str) {
    return str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-');
}

export function sentenceToCamelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export function camelCaseToSentence(input, isOnlyFirst = true) {
    if (!input) return;
    if (typeof input === 'string') input = [input];
    return input.map(key => key.replace(/[A-Z]/g, letter => (isOnlyFirst) ? ` ${letter.toLowerCase()}` : ` ${letter}`).replace(/[a-z]/, letter => letter.toUpperCase())).join(' » ')
};

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
};

export function sortByIds(arr, ids, key = 'id') {
    return arr.sort((el1, el2) => ids.indexOf(el1[key]) - ids.indexOf(el2[key]))
};

export function setMinMax(value, min = 0, max = 100) {
    return Math.min(Math.max(value, min), max);
}

export function typeOf(obj) {
    return /[\s-]\w+(|\])/.exec(Object.prototype.toString.call(obj))[0].trim();
}

function saveToStorage(key, value) {
    if (!value) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value) || null);
}

function loadFromStorage(key) {
    let data = localStorage.getItem(key);
    return (data) ? JSON.parse(data) : undefined;
}

const DEBOUNCES = {};
export function debounce(fn, id = 0, delay = 500) {
    clearTimeout(DEBOUNCES[id]);
    DEBOUNCES[id] = null;
    return ((...args) => {
        DEBOUNCES[id] = setTimeout(() => {
            delete DEBOUNCES[id];
            if (typeof fn === 'function')
                fn(...args);
        }, delay);
    })();
}

export async function futureRun(ms, fn) {
    const timer = (ms) => new Promise(res => setTimeout(res, ms));
    await timer(ms);
    return fn();
}

export function randomHexColor() {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
}

function loadFromJSON(url = '/demo/demo.json') {
    var request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send(null);
    return JSON.parse(request.responseText);
}

function deepCompareArray(arr1, arr2) {
    const float_obj1 = _floatObject(arr1);
    const float_obj2 = _floatObject(arr2);
    var res = [];
    arr1 = Object.fromEntries(
        Object.entries(float_obj1).filter(([key, value]) => value !== float_obj2[key]))
    arr2 = Object.fromEntries(
        Object.entries(float_obj2).filter(([key, value]) => value !== float_obj1[key]));
    const merged = { ...arr1, ...arr2 };
    for (var key in merged) {
        const value1 = arr1[key];
        const value2 = arr2[key];
        if (value1 === value2) continue;
        if (_objectType(value1).date && _objectType(value2).date && value1.getTime() === value2.getTime()) continue;
        if (!res.includes(parseInt(key.split(',')[0]))) res.push(parseInt(key.split(',')[0]));
    }
    return res;
}

export function deepCompare(obj1, obj2) {
    const VALUE_CREATED = "CREATED";
    const VALUE_UPDATED = "UPDATED";
    const VALUE_DELETED = "DELETED";
    const float_obj1 = _floatObject(obj1);
    const float_obj2 = _floatObject(obj2);

    obj1 = Object.fromEntries(
        Object.entries(float_obj1).filter(([key, value]) => value !== float_obj2[key]))
    obj2 = Object.fromEntries(
        Object.entries(float_obj2).filter(([key, value]) => value !== float_obj1[key]));
    const merged = { ...obj1, ...obj2 };

    var res = [];
    for (var key in merged) {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (value1 === value2) continue;
        if (_objectType(value1).date && _objectType(value2).date && value1.getTime() === value2.getTime()) continue;
        var type = VALUE_UPDATED;
        if (value1 === undefined) type = VALUE_CREATED;
        if (value2 === undefined) type = VALUE_DELETED;
        res.push({ type, timestamp: Date.now(), data: { key, value: (value2) ? value2 : value1, previous: value1 } })
    }
    return res;
}

function _objectType(obj) {
    const type = Object.prototype.toString.call(obj);
    return {
        date: type === "[object Date]",
        array: type === "[object Array]",
        object: type === "[object Object]",
        value: type !== "[object Array]" && type !== "[object Object]",
        function: type === "[object Function]",
    }
}

function _floatObject(obj, path = [], map = {}) {
    if (_objectType(obj).object || _objectType(obj).array) {
        for (var key in obj) {
            if (key[0] === '_') continue;
            const value = obj[key];
            if (_objectType(value).object || _objectType(value).array) {
                _floatObject(value, path.concat([key]), map);
            } else {
                key = (path.length) ? path + ',' + key : key;
                map[key] = value;
            }
        }
    }
    return map;
}

export function makeId(length = 8) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
