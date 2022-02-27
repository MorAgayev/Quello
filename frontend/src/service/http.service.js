import Axios from 'axios'
import router from '@/router/index'
import { userService } from './user.service'

const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/api/'
    : '//localhost:3030/api/'


var axios = Axios.create({
    withCredentials: true
})

export const httpService = {
    get(endpoint, data) {
        return ajax(endpoint, 'GET', data);
    },
    post(endpoint, data, query) {
        return ajax(endpoint, 'POST', data, query);
    },
    put(endpoint, data, query) {
        return ajax(endpoint, 'PUT', data, query);
    },
    delete(endpoint, data, query) {
        return ajax(endpoint, 'DELETE', data, query);
    }
}

async function ajax(endpoint, method = 'GET', data = null, query = null) {
    try {
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: query //|| (method === 'GET') ? data : null,
        })
        return res.data
    } catch (err) {
        // console.log(`Had issues ${method}ing to the backend, endpoint: ${endpoint}, with data:`, data)
        // console.dir(err)
        if (err.response)
            switch (err.response.status) {
                case 401:
                    userService.logout();
                    // window.location.assign('/#/login')
                    // window.location.assign('/login')
                    router.push('/login');
                    break;
            }
        throw err
    }
}