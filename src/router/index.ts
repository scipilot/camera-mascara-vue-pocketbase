import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import GalleryView from '@/views/GalleryView.vue'
import CameraView from '@/views/CameraView.vue'
import MeterView from '@/views/MeterView.vue'
import DeviceView from '@/views/DeviceView.vue'
import DeviceQueryView from '@/views/DeviceQueryView.vue'
import DeviceWriteView from '@/views/DeviceWriteView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/camera',
      name: 'camera',
      meta: { private: true },
      component: CameraView,
    },
    {
      path: '/gallery',
      name: 'gallery',
      meta: { private: true },
      component: GalleryView,
    },
    {
      path: '/meter',
      name: 'meter',
      meta: { private: true },
      component: MeterView,
    },
    {
      path: '/device',
      name: 'device',
      meta: { private: true },
      component: DeviceView,
    },
    {
      path: '/device/query',
      name: 'device/query',
      meta: { private: true },
      component: DeviceQueryView,
    },
    {
      path: '/device/write',
      name: 'device/write',
      meta: { private: true },
      component: DeviceWriteView,
    },

  ],
})

export default router
