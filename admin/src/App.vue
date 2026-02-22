<template>
  <!-- Login gate -->
  <LoginPage v-if="!isLoggedIn" @login-success="onLoginSuccess" />

  <!-- Main layout -->
  <div v-else class="layout">
    <TheSidebar :current-page="currentPage" :pages="pages" @navigate="currentPage = $event" @logout="doLogout" />

    <div class="main">
      <div class="topbar">
        <span class="topbar-title">{{ pages.find(p => p.id === currentPage)?.label }}</span>
      </div>

      <DashboardPage v-if="currentPage === 'dashboard'" />
      <OrdersPage  v-else-if="currentPage === 'orders'" />
      <ProductsPage v-else-if="currentPage === 'products'" />
      <ProductCategoriesPage v-else-if="currentPage === 'product-categories'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi }      from './composables/useApi.js'
import LoginPage       from './components/LoginPage.vue'
import TheSidebar      from './components/TheSidebar.vue'
import OrdersPage      from './components/OrdersPage.vue'
import ProductsPage    from './components/ProductsPage.vue'
import ProductCategoriesPage    from './components/ProductCategoriesPage.vue'
import DashboardPage from './components/DashboardPage.vue'

const { get, post } = useApi()

const isLoggedIn  = ref(false)
const currentPage = ref('dashboard')
const pages = [
  { id: 'dashboard',   label: 'Dashboard',   icon: '📊' },
  { id: 'orders',   label: 'Pesanan',   icon: '🛒' },
  { id: 'products', label: 'Produk', icon: '📦' },
  { id: 'product-categories', label: 'Kategori Produk', icon: '🗂️' },
]

function onLoginSuccess() {
  isLoggedIn.value  = true
  currentPage.value = 'dashboard'
}

async function doLogout() {
  await post('/logout').catch(() => {})
  isLoggedIn.value = false
}

async function bootstrapAuth() {
  const json = await get('/session').catch(() => null)
  isLoggedIn.value = !!json?.success
}

onMounted(bootstrapAuth)
</script>
