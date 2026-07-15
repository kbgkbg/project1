import { createRouter, createWebHashHistory } from 'vue-router'
import PickView from '../views/PickView.vue'

const routes = [
  { path: '/', name: 'pick', component: PickView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router