import { createRouter, createWebHistory } from 'vue-router'
import BoardsView from '../views/BoardsView.vue'
import BoardDetailView from '../views/BoardDetailView.vue'

const routes = [
  { path: '/boards', component: BoardsView },
  { path: '/board/:id', component: BoardDetailView, props: true },
  { path: '/', redirect: '/boards' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
