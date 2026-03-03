<template>

  <Card v-if="paymentMethod === 'qris' || paymentMethod === 'bank'">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <Truck class="w-6 h-6 text-[#7BA87D]" />
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
        Pilih Kurir Pengiriman
      </h2>
    </div>

    <!-- Courier list -->
    <div class="grid gap-3">
      <div
        v-if="loading"
        class="rounded-lg border border-[#7BA87D]/30 bg-[#7BA87D]/10 px-3 py-2 text-sm text-[#2C4A2F]"
      >
        Menghitung ongkir terbaik...
      </div>

      <div v-for="courier in couriers" 
        :key="courier.code" 
        @click="!loading && emit('update:modelValue', courier.code)" 
        :class="[
          'border-2 rounded-xl p-4 transition',
          modelValue === courier.code
            ? 'border-[#7BA87D] bg-[#7BA87D]/5'
            : 'border-gray-200',
          loading
            ? 'cursor-wait opacity-80'
            : 'cursor-pointer hover:border-gray-300'
        ]"
      >

        <div class="flex justify-between items-center">
          <!-- Left -->
          <div class="flex items-center gap-3">
            <input type="radio" 
              :value="courier.code" 
              :checked="modelValue === courier.code" 
              class="accent-[#7BA87D]" 
            />

            <div>
              <div class="font-semibold">
                {{ courier.name }}
              </div>

              <div class="text-sm text-gray-500">
                <span v-if="loading">
                  <span class="block h-4 w-24 rounded bg-gray-200 animate-pulse"></span>
                </span>

                <span v-else>
                  Estimasi:
                  {{ shippingCosts[courier.code]?.etd || "-" }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right -->
          <div class="font-bold text-[#7BA87D] text-right">
            <span v-if="loading">
              <span class="inline-block h-6 w-20 rounded bg-gray-200 animate-pulse"></span>
            </span>

            <span v-else-if="shippingCosts[courier.code]">
              <template v-if="isFreeShippingEligible">
                <span class="text-green-600">
                  GRATIS
                </span>
                <span class="block text-xs font-medium text-gray-500 line-through">
                  {{ formatPrice(shippingCosts[courier.code].price) }}
                </span>
              </template>

              <template v-else>
                {{ formatPrice(shippingCosts[courier.code].price) }}
              </template>
            </span>

            <span v-else>
              -
            </span>
          </div>
        </div>

      </div>

    </div>

    <!-- Info -->
    <div class="mt-5 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
      <div class="flex gap-3">
        <div class="text-2xl">🚚</div>
        <div>
          <p class="text-base text-blue-900 font-semibold mb-1">
            Informasi Pengiriman:
          </p>
          <p class="text-sm text-blue-800">
            Kurir dipilih karena Anda memilih metode pembayaran
            {{ paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank' }}.
            Untuk COD, ongkir gratis!
          </p>
        </div>
      </div>
    </div>

  </Card>

</template>

<script setup>
import { Truck } from "lucide-vue-next"
import { useProducts } from "../composables/useProducts"
import Card from '../components/ui/Card.vue'

const { formatPrice } = useProducts()

const props = defineProps({
  modelValue: [String, Number],
  couriers: Array,
  shippingCosts: Object,
  loading: Boolean,
  paymentMethod: String,
  isFreeShippingEligible: Boolean,
})

const emit = defineEmits(["update:modelValue"])
</script>
