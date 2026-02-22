// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Layout from './components/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('./pages/HomePage.vue')
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('./pages/ProductsPage.vue')
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: () => import('./pages/ProductDetailPage.vue')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('./pages/CartPage.vue')
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('./pages/CheckoutPage.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
