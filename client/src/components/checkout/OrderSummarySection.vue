<template>
  <div class="lg:col-span-1 min-w-0">
    <Card
      class="w-full max-w-full p-4 sm:p-6 lg:p-6 lg:sticky lg:top-24"
    >
      <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Ringkasan Pesanan
      </h2>

      <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto pr-1">
        <div
          v-for="item in cart"
          :key="item.cartKey"
          class="flex gap-3 min-w-0 items-center"
        >
          <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
            <img
              :src="item.imageUrl"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-sm sm:text-base font-semibold text-gray-900 truncate">
              {{ item.name }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-600 truncate">
              {{ item.quantity }}x {{ item.unitLabel || item.unitCode?.toUpperCase() || 'unit' }}
              @ Rp {{ item.price.toLocaleString('id-ID') }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-2 sm:space-y-3 mb-4 sm:mb-6 border-t pt-3 sm:pt-4">
        <template v-if="checkoutStore.paymentMethodType !== 'cod'">
          <div
            v-if="checkoutStore.freeShippingMin > 0 && !checkoutStore.isFreeShippingEligible"
            class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs sm:text-sm text-amber-800"
          >
            Belanja lagi <span class="font-semibold">{{ formatPrice(checkoutStore.remainingForFreeShipping) }}</span>
            untuk dapat gratis ongkir.
          </div>

          <div
            v-else-if="checkoutStore.freeShippingMin > 0 && checkoutStore.isFreeShippingEligible"
            class="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs sm:text-sm text-green-800"
          >
            🎉 Selamat! Pesanan Anda memenuhi syarat gratis ongkir.
          </div>
        </template>

        <div class="flex justify-between text-sm sm:text-base lg:text-lg gap-3">
          <span class="text-gray-600">Subtotal</span>
          <span class="font-semibold text-right break-all">
            {{ formatPrice(checkoutStore.subtotal) }}
          </span>
        </div>

        <div class="flex justify-between text-sm sm:text-base lg:text-lg">
          <span class="text-gray-600">Total Berat</span>
          <span class="font-semibold">{{ formatWeight(cartStore.totalWeight) }}</span>
        </div>

        <div class="flex justify-between text-sm sm:text-base lg:text-lg gap-3">
          <span class="text-gray-600">Ongkir</span>

          <span v-if="shippingStore.loadingShippingCosts">
            <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
          </span>

          <span
            v-else-if="checkoutStore.appliedShippingCost !== 0"
            class="font-semibold text-right break-all"
          >
            {{ formatPrice(checkoutStore.appliedShippingCost) }}
          </span>

          <span
            v-else-if="checkoutStore.paymentMethodType === 'cod' || checkoutStore.isFreeShippingEligible"
            class="font-semibold text-green-600"
          >
            GRATIS
          </span>

          <span
            v-else
            class="font-semibold text-right break-all"
          >
            -
          </span>
        </div>

        <div class="border-t pt-3">
          <div class="flex justify-between items-start gap-3">
            <span class="text-base sm:text-xl lg:text-2xl font-bold">
              Total
            </span>

            <span class="text-lg sm:text-xl lg:text-2xl font-bold text-[#7BA87D] text-right break-all">
              {{ formatPrice(checkoutStore.grandTotal) }}
            </span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        :disabled="checkoutStore.loading"
        variant="success"
        size="lg"
        class="w-full justify-center"
      >
        <template v-if="checkoutStore.loading">
          <span class="animate-spin mr-2">⏳</span>
          Memproses...
        </template>

        <template v-else>
          <CheckCircle class="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          Konfirmasi Pesanan
        </template>
      </Button>

      <div
        v-if="checkoutStore.paymentMethodType === 'cod'"
        class="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg"
      >
        <p class="text-xs sm:text-sm text-green-800 text-center">
          ✅ Bayar saat barang diterima
        </p>
      </div>

      <div
        v-if="checkoutStore.paymentMethodType === 'qris'"
        class="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg"
      >
        <p class="text-xs sm:text-sm text-blue-800 text-center">
          📱 Silakan scan QR Code untuk pembayaran
        </p>
      </div>

      <div
        v-if="checkoutStore.paymentMethodType === 'bank'"
        class="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg"
      >
        <p class="text-xs sm:text-sm text-blue-800 text-center">
          🏦 Transfer ke rekening bank yang tertera
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { CheckCircle } from 'lucide-vue-next'
import Button from '../ui/Button.vue'
import Card from '../ui/Card.vue'

defineProps({
  cart: {
    type: Array,
    required: true,
  },
  cartStore: {
    type: Object,
    required: true,
  },
  shippingStore: {
    type: Object,
    required: true,
  },
  checkoutStore: {
    type: Object,
    required: true,
  },
  formatPrice: {
    type: Function,
    required: true,
  },
  formatWeight: {
    type: Function,
    required: true,
  },
})
</script>
