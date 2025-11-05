// /client/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import BoardsView from '../views/BoardsView.vue'
import BoardDetailView from '../views/BoardDetailView.vue'

const routes = [
  { path: '/', redirect: '/boards' },
  { path: '/boards', component: BoardsView },
  { path: '/board/:id', component: BoardDetailView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
