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
      <div v-for="courier in couriers" 
        :key="courier.code" 
        @click="emit('update:modelValue', courier.code)" 
        :class="[
          'border-2 rounded-xl p-4 cursor-pointer transition',
          modelValue === courier.code
            ? 'border-[#7BA87D] bg-[#7BA87D]/5'
            : 'border-gray-200 hover:border-gray-300'
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
                  Menghitung...
                </span>

                <span v-else>
                  Estimasi:
                  {{ shippingCosts[courier.code]?.etd || "-" }}
                </span>
              </div>
            </div>
          </div>

          <!-- Right -->
          <div class="font-bold text-[#7BA87D]">
            <span v-if="loading">
              ...
            </span>

            <span v-else-if="shippingCosts[courier.code]">
              {{ formatPrice(shippingCosts[courier.code].price) }}
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
import { computed } from "vue"
import { Truck } from "lucide-vue-next"
import { useShippingStore } from "../stores/shippingStore"
import { useProducts } from "../composables/useProducts"
import Card from '../components/ui/Card.vue'

const { formatPrice } = useProducts()

const props = defineProps({
  modelValue: [String, Number],
  couriers: Array,
  shippingCosts: Object,
  loading: Boolean,
  paymentMethod: String,
})

const emit = defineEmits(["update:modelValue"])

const shippingStore = useShippingStore()
</script>