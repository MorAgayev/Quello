import axios from 'axios';
import { getBase64FromUrl, imageLoader, getImgAvgColor } from '../service/util.service';

export async function uploadImg(ev) {
    const UPLOAD_PRESET = 'qwello'
    const CLOUD_NAME = '<CLOUDE_NAME>'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const FORM_DATA = new FormData();
    // Building the request body
    FORM_DATA.append('file', ev.target.files[0])
    FORM_DATA.append('upload_preset', UPLOAD_PRESET)
    // Sending a post method request to Cloudniarys' API
    try {
        const res = await axios.post(UPLOAD_URL, FORM_DATA)
        return res.data;
    } catch (err) {
        console.error('ERROR!', err)
    }
}

export function getUnsplash({ page, perPage, orderBy, query = 'wallpaper' }) {
    const PHOTOS_API = '<API KEY>';
    const axios = require('axios');
    const apiClient = axios.create({
        baseURL: 'https://api.unsplash.com',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    });
    return apiClient.get(
        `/search/photos?client_id=${PHOTOS_API}&page=${page}&per_page=${perPage}&order_by=${orderBy}&query=${query}`
    );
}

export async function loadCover(url) {
    if (!url) return '';
    try {
        var load;
        await getBase64FromUrl(url)
            .then((data) =>
                imageLoader(data).then((data) => (load = data))
            );
        return await getImgAvgColor(load, 1, 1);
    } catch (err) {
        return '';
    }
}
