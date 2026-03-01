import { createRouter, createWebHistory } from 'vue-router'
import DashboardPage from './pages/DashboardPage.vue'
import OrdersPage from './pages/OrdersPage.vue'
import ProductsPage from './pages/ProductsPage.vue'
import ProductCategoriesPage from './pages/ProductCategoriesPage.vue'

const EmptyPage = { template: '<div />' }

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'login', component: EmptyPage, meta: { title: 'Login', public: true } },
  { path: '/dashboard', name: 'dashboard', component: DashboardPage, meta: { title: 'Dashboard' } },
  { path: '/orders', name: 'orders', component: OrdersPage, meta: { title: 'Pesanan' } },
  { path: '/products', name: 'products', component: ProductsPage, meta: { title: 'Produk' } },
  {
    path: '/product-categories',
    name: 'product-categories',
    component: ProductCategoriesPage,
    meta: { title: 'Kategori Produk' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
