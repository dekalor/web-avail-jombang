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
            <ShoppingCart class="w-6 h-6" />
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
    <footer class="bg-[#2C4A2F] text-white py-10 sm:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          <div>
            <h3 class="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">AVAIL</h3>
            <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
              Solusi kesehatan herbal alami terpercaya untuk keluarga Indonesia.
            </p>
            <div class="mt-5 sm:mt-6 space-y-2">
              <div class="flex items-center gap-3">
                <MessageCircleCheck class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#7BA87D]" />
                <a href="https://wa.me/6281332224169" class="text-sm sm:text-base text-gray-300 hover:text-white transition-colors">
                  +62 813-3222-4169
                </a>
              </div>
              <div class="flex items-center gap-3">
                <Mail class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#7BA87D]" />
                <a href="mailto:yunari.deta@gmail.com" class="text-sm sm:text-base text-gray-300 hover:text-white transition-colors break-all">
                  yunari.deta@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2">
            <h4 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Lokasi Toko & Jam Operasional</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <article
                v-for="store in stores"
                :key="store.name"
                class="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5"
              >
                <h5 class="text-sm sm:text-base font-semibold text-white mb-3">{{ store.name }}</h5>
                <a
                  :href="store.mapsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-start gap-3 text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                >
                  <MapPin class="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 text-[#7BA87D]" />
                  <span class="leading-relaxed">{{ store.address }}</span>
                </a>

                <div class="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                  <p
                    v-for="hour in store.hours"
                    :key="`${store.name}-${hour.day}`"
                    class="text-xs sm:text-sm text-gray-300"
                  >
                    <span class="text-gray-200">{{ hour.day }}:</span>
                    {{ hour.time }}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 sm:pt-8 border-t border-gray-700 text-center text-xs sm:text-sm text-gray-400">
          © {{ currentYear }} AVAIL Jombang. Semua hak cipta dilindungi.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cartStore'
import { MapPin, MessageCircleCheck, Mail, ShoppingCart } from 'lucide-vue-next';

const cart = useCartStore()
const totalItems = computed(() => cart.totalItems)
const currentYear = new Date().getFullYear()

const stores = [
  {
    name: 'Percetakan Prisma Offset',
    mapsUrl: 'https://maps.app.goo.gl/bSz92r3zgQM5kuer5',
    address: 'Jl. IR. H. Juanda No.56, Kepanjen, Jombang, Jawa Timur',
    hours: [
      { day: 'Senin - Sabtu', time: '08:00 - 16:30' },
      { day: 'Minggu', time: 'Tutup' },
    ],
  },
  {
    name: 'Perum Pulo Asri',
    mapsUrl: 'https://maps.app.goo.gl/J8BeUBBHZC3jZR2s7',
    address: 'Perum Pulo Asri Blok K-8, Pulo Lor, Jombang, Jawa Timur',
    hours: [
      { day: 'Senin - Sabtu', time: '17:00 - 21:30' },
      { day: 'Minggu', time: '08:00 - 17:00' },
    ],
  },
]
</script>
