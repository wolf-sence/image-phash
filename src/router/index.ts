import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pages/HomePage.vue'
import Main from '@/pages/MainPage.vue'
import GaussianBar from '@/pages/GaussianBar.vue'
import MosaicPage from '@/pages/MosaicPage.vue'
import PHashVue from '@/pages/PHash.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/phash',
    name: 'Phash',
    component: PHashVue
  },
  {
    path: '/main',
    name: 'Main',
    component: Main
  },
  {
    path: '/MosaicPage',
    name: 'Mosaic',
    component: MosaicPage
  },
  {
    path: '/gaussian',
    name: 'GaussianBar',
    component: GaussianBar
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export { router, routes }
