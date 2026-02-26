<template>
  <div class="min-h-screen bg-[#F5F1E8] flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-3">
            <div class="w-12 h-12 bg-[#7BA87D] rounded-lg flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l7 18M19 3l-7 18M9 9h6"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-semibold text-[#2C4A2F]">AVAIL</h1>
              <p class="text-sm text-gray-600">Sehat Alami untuk Anda</p>
            </div>
          </router-link>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-8 text-lg">
            <router-link to="/" class="text-gray-700 hover:text-[#7BA87D] transition-colors">
              Home
            </router-link>
            <router-link to="/products" class="text-gray-700 hover:text-[#7BA87D] transition-colors">
              Produk Kami
            </router-link>
          </nav>

          <!-- Cart Button -->
          <button
            @click="$router.push('/cart')"
            class="relative text-lg px-6 py-3 border-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span
              v-if="totalItems > 0"
              class="absolute -top-2 -right-2 bg-[#7BA87D] text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold"
            >
              {{ totalItems }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-[#2C4A2F] text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-2xl font-semibold mb-4">AVAIL</h3>
            <p class="text-gray-300">Solusi kesehatan herbal alami terpercaya untuk keluarga Indonesia.</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">Hubungi Kami</h4>
            <p class="text-gray-300">Email: info@avail.co.id</p>
            <p class="text-gray-300">WhatsApp: +62 812-3456-7890</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">Jam Operasional</h4>
            <p class="text-gray-300">Senin - Jumat: 08:00 - 17:00</p>
            <p class="text-gray-300">Sabtu: 09:00 - 15:00</p>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          © 2025 AVAIL. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'

const cart = useCartStore()
const totalItems = computed(() => cart.totalItems)
</script>
