import Vue from 'vue'
import VueRouter from 'vue-router'
import home from '../views/home.vue'
import board from '../views/board.vue'
import login from '../views/login.vue'
import boardList from '../views/board-list.vue'
import dashboard from '../views/dashboard.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: home
  },
  {
    path: '/board',
    name: 'board-list',
    component: boardList
  },
  {
    path: '/board/:id',
    name: 'board',
    component: board,
  },
  {
    path: '/board/:id/dashboard',
    name: 'dashboard',
    component: dashboard
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
