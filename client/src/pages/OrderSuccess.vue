<template>
  <div class="min-h-screen py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
    <div class="max-w-3xl mx-auto">
      <Card class="p-6 sm:p-8 lg:p-10">
        <div class="text-center">
          <div
            class="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
          >
            <CheckCircle class="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
          </div>

          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Pesanan Berhasil Dibuat
          </h1>
          <p class="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4">
            Terima kasih sudah berbelanja di AVAIL Jombang. Pesanan Anda sedang kami proses.
          </p>
        </div>

        <div class="mt-6 sm:mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
          <p class="text-xs sm:text-sm text-gray-500 mb-2">Nomor Pesanan</p>
          <p class="text-lg sm:text-xl lg:text-2xl font-bold text-[#2C4A2F] break-all">
            {{ orderNumber || '-' }}
          </p>

          <div class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between gap-3">
            <span class="text-sm sm:text-base text-gray-600">Total Pesanan</span>
            <span class="text-base sm:text-lg font-semibold text-gray-900">
              {{ formatPrice(total) }}
            </span>
          </div>
        </div>

        <div class="mt-5 sm:mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <p class="text-sm sm:text-base text-blue-900">
            Kami akan menghubungi Anda dalam 1x24 jam untuk konfirmasi pesanan.
          </p>
        </div>

        <div class="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            @click="goToHome"
            class="w-full bg-[#7BA87D] hover:bg-[#6A9570] text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Kembali ke Beranda
          </button>
          <button
            type="button"
            @click="goToProducts"
            class="w-full border-2 border-gray-300 hover:border-[#7BA87D] text-gray-700 hover:text-[#7BA87D] py-3 rounded-lg font-semibold transition-colors"
          >
            Belanja Lagi
          </button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import { CheckCircle } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const orderNumber = computed(() => String(route.query.order_number || ''))
const total = computed(() => Number(route.query.total || 0))

function formatPrice(price) {
  return `Rp ${Number(price).toLocaleString('id-ID')}`
}

function goToHome() {
  router.push('/')
}

function goToProducts() {
  router.push('/products')
}
</script>
