<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <img
        :src="product.imageUrl"
        :alt="product.name"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      
      <!-- Discount Badge -->
      <div 
        v-if="discount > 0"
        class="absolute top-3 left-3 bg-[#E85D4A] text-white px-3 py-1.5 rounded-lg text-base font-semibold">
        -{{ discount }}%
      </div>
    </div>

    <!-- Product Details -->
    <div class="p-5 flex-1 flex flex-col">
      <div class="mb-2">
        <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {{ product.category.name }}
        </span>
      </div>

      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        {{ product.name }}
      </h3>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="mt-auto">
        <!-- Price -->
        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-2xl font-bold text-[#7BA87D]">
            {{ formatPrice(product.price) }}
          </span>
          <span
            v-if="product.originalPrice"
            class="text-lg text-gray-400 line-through"
          >
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="viewDetails"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Lihat Detail
          </button>
          <button
            @click="addToCart"
            :class="[
              'bg-[#7BA87D] hover:bg-[#6A9570] text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer',

              isAdded
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-[#7BA87D] hover:bg-[#6A9570] text-white'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span class="hidden sm:inline">Beli</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProducts } from '../composables/useProducts'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Router and stores
const router = useRouter()
const cart = useCartStore()
const isAdded = ref(false)

const { formatPrice, calculateDiscount } = useProducts()

const discount = computed(() =>
  calculateDiscount(props.product.price, props.product.originalPrice)
)

function viewDetails() {
  router.push(`/products/${props.product.id}`)
}

function addToCart() {
  cart.addToCart(props.product)
}

function handleImageError(e) {
  e.target.src = 'https://via.placeholder.com/400?text=AVAIL'
}
</script>
