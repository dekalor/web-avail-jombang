<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Product Not Found -->
      <div v-if="!product" class="text-center py-16">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          Produk tidak ditemukan
        </h2>
        <button
          @click="$router.push('/products')"
          class="bg-[#7BA87D] text-white px-6 py-3 rounded-lg"
        >
          Kembali ke Produk
        </button>
      </div>

      <!-- Product Details -->
      <div v-else>
        <div class="grid lg:grid-cols-2 gap-12 mb-12">
          <!-- Product Image -->
          <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
            <img
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Product Info -->
          <div>
            <div class="mb-6">
              <span class="inline-block bg-[#7BA87D]/10 text-[#7BA87D] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {{ product.category }}
              </span>
              <h1 class="text-4xl lg:text-5xl font-bold text-[#2C4A2F] mb-4">
                {{ product.name }}
              </h1>
              <p class="text-xl text-gray-600 leading-relaxed">
                {{ product.description }}
              </p>
            </div>

            <!-- Price -->
            <div class="mb-8">
              <div class="flex items-baseline gap-3">
                <span class="text-4xl font-bold text-[#7BA87D]">
                  {{ formatPrice(product.price) }}
                </span>
                <span
                  v-if="product.originalPrice"
                  class="text-2xl text-gray-400 line-through"
                >
                  {{ formatPrice(product.originalPrice) }}
                </span>
                <span
                  v-if="discount > 0"
                  class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                >
                  Hemat {{ discount }}%
                </span>
              </div>
            </div>

            <!-- Benefits -->
            <div class="mb-8">
              <h3 class="text-2xl font-semibold text-gray-900 mb-4">
                Manfaat Produk
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="(benefit, index) in product.benefits"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <svg class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-lg text-gray-700">{{ benefit }}</span>
                </li>
              </ul>
            </div>

            <!-- Quantity Selector -->
            <div class="mb-6">
              <label class="block text-lg font-semibold text-gray-900 mb-3">
                Jumlah
              </label>
              <div class="flex items-center gap-4">
                <button
                  @click="decrementQuantity"
                  class="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-[#7BA87D] hover:bg-[#7BA87D]/10 transition-colors flex items-center justify-center"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <span class="text-2xl font-semibold min-w-[4rem] text-center">
                  {{ quantity }}
                </span>
                <button
                  @click="incrementQuantity"
                  class="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-[#7BA87D] hover:bg-[#7BA87D]/10 transition-colors flex items-center justify-center"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-4">
              <button
                @click="addToCart"
                class="flex-1 bg-[#7BA87D] hover:bg-[#6A9570] text-white py-4 px-6 rounded-lg text-lg font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Tambah ke Keranjang
              </button>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div class="mt-16">
          <h2 class="text-3xl font-bold text-[#2C4A2F] mb-8">
            Produk Terkait
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <ProductCard
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              :product="relatedProduct"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const { products, product, getProductById, formatPrice, calculateDiscount } = useProducts()

const quantity = ref(1)

const discount = computed(() =>
  product ? calculateDiscount(product.price, product.originalPrice) : 0
)

const relatedProducts = computed(() =>
  products.value
    .filter(p => p.id !== route.params.id && p.category === product?.category)
    .slice(0, 3)
)

function incrementQuantity() {
  quantity.value++
}

function decrementQuantity() {
  if (quantity.value > 1) quantity.value--
}

function addToCart() {
  if (!product) return
  for (let i = 0; i < quantity.value; i++) {
    cart.addToCart(product.value)
  }
  router.push('/cart')
}

onMounted(() => {
  const product_id = route.params.id
  getProductById(product_id)
})
</script>
