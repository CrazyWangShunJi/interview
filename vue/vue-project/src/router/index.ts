import { createRouter, createWebHistory } from 'vue-router'
import A from '../components/A/componentA.vue'
import B from '../components/B/componentB.vue'

const routes = [
  {
    path: "/A",
    name: 'A',
    component: A
  },
  {
    path: "/B",
    name: 'B',
    component: B
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 使用history模式
  routes: routes,
})

export default router
