import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PickView from '../views/PickView.vue'
import PlaceView from '../views/PlaceView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/pick', name: 'pick', component: PickView },
  { path: '/place/:id', name: 'place', component: PlaceView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router