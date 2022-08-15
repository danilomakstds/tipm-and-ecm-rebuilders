import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/home'
  },
  {
    path: '/product-details',
    component: () => import('@/views/ProductDetails.vue')
  },
  {
    path: '/order-details',
    component: () => import('@/views/OrderDetails.vue')
  },
  {
    path: '/cart',
    component: () => import('@/views/CartPage.vue')
  },
  {
    path: '/profile',
    component: () => import('@/views/ProfilePage.vue')
  },
  {
    path: '/reviews',
    component: () => import('@/views/ReviewPage.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        component: () => import('@/views/HomePage.vue')
      },
      {
        path: 'products',
        component: () => import('@/views/ProductsPage.vue')
      },
      {
        path: 'orders',
        component: () => import('@/views/OrdersPage.vue')
      },
      {
        path: 'youtube',
        component: () => import('@/views/YoutubePlayer.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
