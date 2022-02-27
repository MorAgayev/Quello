const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../service/logger.service')

async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)
    const user = await userService.get({ username })
    if (!user) return Promise.reject('Invalid username or password');
    else if (!bcrypt.compare(password, user.password)) return Promise.reject('Invalid password');
    delete user.password
    return user
}

async function signup(username, password, fullname) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) return Promise.reject('fullname, username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds);
    return userService.add({ username, password: hash, fullname })
}

module.exports = {
    signup,
    login,
}