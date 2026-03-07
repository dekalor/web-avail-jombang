<template>
  <div v-if="authChecking" class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="panel px-5 py-4 text-sm font-medium text-gray-600">Checking session…</div>
  </div>

  <LoginPage v-else-if="!isLoggedIn" @login-success="onLoginSuccess" />

  <div v-else class="min-h-screen bg-gray-50 text-gray-900">
    <TheSidebar
      :current-page="currentPage"
      :pages="pages"
      :open="sidebarOpen"
      @navigate="navigateTo"
      @logout="doLogout"
      @close="sidebarOpen = false"
    />

    <div class="md:pl-72">
      <header class="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div class="flex h-16 items-center justify-between px-4 md:px-6">
          <div class="flex items-center gap-3">
            <button
              class="btn-base btn-secondary md:hidden"
              @click="sidebarOpen = true"
              aria-label="Open sidebar"
            >
              <span>☰</span>
            </button>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Admin Panel</p>
              <h1 class="text-lg font-bold text-gray-900">{{ currentLabel }}</h1>
            </div>
          </div>
          <a href="/" target="_blank" class="btn-base btn-secondary">Lihat Toko</a>
        </div>
      </header>

      <main class="p-4 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from './composables/useApi.js'
import LoginPage from './pages/LoginPage.vue'
import TheSidebar from './components/TheSidebar.vue'

const { get, post } = useApi()
const route = useRoute()
const router = useRouter()

const isLoggedIn = ref(false)
const authChecking = ref(true)
const sidebarOpen = ref(false)

const pages = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'orders', path: '/orders', label: 'Pesanan', icon: '🛒' },
  { id: 'products', path: '/products', label: 'Produk', icon: '📦' },
  { id: 'product-categories', path: '/product-categories', label: 'Kategori Produk', icon: '🗂️' },
]

const currentPage = computed(() => String(route.name || 'dashboard'))
const currentLabel = computed(() => {
  if (route.meta?.title) return String(route.meta.title)
  return pages.find(p => p.id === currentPage.value)?.label || 'Dashboard'
})

function navigateTo(pageId) {
  const page = pages.find(p => p.id === pageId)
  if (!page) return
  sidebarOpen.value = false
  if (route.path !== page.path) router.push(page.path)
}

async function onLoginSuccess() {
  isLoggedIn.value = true
  if (route.path === '/login') {
    await router.push('/dashboard')
  }
}

async function doLogout() {
  await post('/logout').catch(() => {})
  isLoggedIn.value = false
  sidebarOpen.value = false
  if (route.path !== '/login') {
    await router.push('/login')
  }
}

async function bootstrapAuth() {
  authChecking.value = true
  const json = await get('/session').catch(() => null)
  isLoggedIn.value = !!json?.success

  if (isLoggedIn.value) {
    if (route.path === '/login') {
      await router.replace('/dashboard')
    }
  } else if (route.path !== '/login') {
    await router.replace('/login')
  }

  authChecking.value = false
}

watch(
  () => route.path,
  async (path) => {
    sidebarOpen.value = false
    if (authChecking.value) return

    if (!isLoggedIn.value && path !== '/login') {
      await router.replace('/login')
      return
    }

    if (isLoggedIn.value && path === '/login') {
      await router.replace('/dashboard')
    }
  },
)

onMounted(bootstrapAuth)
</script>
