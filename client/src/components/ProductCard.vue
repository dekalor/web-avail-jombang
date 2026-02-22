<template>
  <RouterLink :to="`/products/${product.id}`">

    <div class="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col bg-white rounded-xl">

      <!-- Image -->
      <div class="relative aspect-square overflow-hidden bg-gray-100">

        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-cover"
        />

        <div
          v-if="discount > 0"
          class="absolute top-3 left-3 bg-[#E85D4A] text-white px-3 py-1.5 rounded-lg text-base font-semibold"
        >
          -{{ discount }}%
        </div>

      </div>



      <!-- Content -->
      <div class="p-5 flex-1 flex flex-col">

        <!-- Category -->
        <div class="mb-2">

          <span class="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {{ product.category.name }}
          </span>

        </div>


        <!-- Name -->
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
          {{ product.name }}
        </h3>


        <!-- Description -->
        <p class="text-base text-gray-600 mb-4 line-clamp-2">
          {{ product.description }}
        </p>


        <!-- Bottom section -->
        <div class="mt-auto">

          <!-- Price -->
          <div class="mb-4">

            <span
              v-if="product.originalPrice"
              class="text-base text-gray-500 line-through mr-2"
            >
              {{ formatPrice(product.originalPrice) }}
            </span>

            <span class="text-2xl font-bold text-[#7BA87D]">
              {{ formatPrice(product.price) }}
            </span>

          </div>


          <!-- Button -->
          <button
            @click="handleAddToCart"
            :class="[
              'w-full text-lg py-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer',

              isAdded
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-[#7BA87D] hover:bg-[#6A9570] text-white'
            ]"
          >

            <!-- Check icon -->
            <Check v-if="isAdded" class="w-5 h-5" />

            <!-- Cart icon -->
            <ShoppingCart v-else class="w-5 h-5" />
            
            {{ isAdded ? 'Ditambahkan!' : 'Tambah ke Keranjang' }}

          </button>

        </div>

      </div>

    </div>

  </RouterLink>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProducts } from '../composables/useProducts'
import { ShoppingCart, Check } from 'lucide-vue-next'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Router and stores
const cart = useCartStore()
const isAdded = ref(false)

const { formatPrice, calculateDiscount } = useProducts()

const discount = computed(() =>
  calculateDiscount(props.product.price, props.product.originalPrice)
)

function handleAddToCart(event) {
  event.preventDefault()

  cart.addToCart(props.product)
  isAdded.value = true

  setTimeout(() => {
    isAdded.value = false
  }, 2000)
}
</script>
