import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PickView from '../views/PickView.vue'
import PlaceView from '../views/PlaceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/pick', name: 'pick', component: PickView },
    { path: '/place/:id', name: 'place', component: PlaceView },
  ],
})

export default router