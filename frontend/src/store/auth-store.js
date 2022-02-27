import { userService } from '../service/user.service'

export default {
    state: {
        loggedinUser: userService.getLoggedinUser(),
        users: [],
    },
    getters: {
        getUsers({ users }) { return users },
        loggedinUser({ loggedinUser }) { return loggedinUser },
    },
    mutations: {
        setLoggedinUser(state, { user }) {
            state.loggedinUser = (user) ? { ...user } : null;
        },
        setUsers(state, { users }) {
            state.users = users;
        },
        // removeUser(state, { userId }) {
        //     state.users = state.users.filter(user => user._id !== userId)
        // },
        // setUserScore(state, { score }) {
        //     state.loggedinUser.score = score
        // },
    },
    actions: {
        async login({ commit }, { user }) {
            try {
                const loggedInUser = await userService.login(user);
                commit({ type: 'setLoggedinUser', user: loggedInUser })
                return loggedInUser;
            } catch (err) {
                console.log('userStore: Error in login', err)
                throw err
            }
        },
        async signup({ commit }, { user }) {
            try {
                const loggedInUser = await userService.signup(user)
                commit({ type: 'setLoggedinUser', user: loggedInUser })
                return loggedInUser;
            } catch (err) {
                console.log('userStore: Error in signup', err)
                throw err
            }

        },
        async logout({ commit }) {
            try {
                await userService.logout();
                commit({ type: 'setLoggedinUser', user: null });
                return null;
            } catch (err) {
                console.log('userStore: Error in logout', err);
                throw err;
            }
        },
        async getUsers({ commit }) {
            const users = await userService.getUsers()
            commit({ type: 'setUsers', users: users['users'] })
        }
    }
}