<template>
  <div class="min-h-screen py-6 sm:py-8 lg:py-12">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

      <!-- Product Not Found -->
      <div v-if="!product" class="text-center py-12 sm:py-16">

        <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4">
          Produk tidak ditemukan
        </h2>

        <button
          @click="$router.push('/products')"
          class="bg-[#7BA87D] text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-sm sm:text-base"
        >
          Kembali ke Produk
        </button>

      </div>

      <!-- Product Details -->
      <div v-else>

        <!-- Main section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-10 lg:mb-12">

          <!-- Product Image -->
          <div class="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 shadow-md sm:shadow-lg lg:shadow-xl">

            <img
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover"
            />

          </div>

          <!-- Product Info -->
          <div>

            <!-- Category -->
            <span class="inline-block bg-[#7BA87D]/10 text-[#7BA87D]
              px-3 py-1.5 sm:px-4 sm:py-2
              rounded-full
              text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              {{ product.category }}
            </span>

            <!-- Title -->
            <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#2C4A2F] mb-3 sm:mb-4">
              {{ product.name }}
            </h1>

            <!-- Description -->
            <p class="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed mb-6">
              {{ product.description }}
            </p>

            <!-- Price -->
            <div class="mb-6 sm:mb-8">

              <div class="flex flex-wrap items-center gap-2 sm:gap-3">

                <span class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7BA87D]">
                  {{ formatPrice(product.price) }}
                </span>

                <span
                  v-if="product.originalPrice"
                  class="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through"
                >
                  {{ formatPrice(product.originalPrice) }}
                </span>

                <span
                  v-if="discount > 0"
                  class="bg-red-500 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold"
                >
                  Hemat {{ discount }}%
                </span>

              </div>

            </div>

            <!-- Benefits -->
            <div class="mb-6 sm:mb-8">

              <h3 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Manfaat Produk
              </h3>

              <ul class="space-y-2 sm:space-y-3">

                <li
                  v-for="(benefit, index) in product.benefits"
                  :key="index"
                  class="flex items-start gap-2 sm:gap-3"
                >

                  <svg
                    class="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9
                      10.586 7.707 9.293a1 1 0 00-1.414
                      1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>

                  <span class="text-sm sm:text-base lg:text-lg text-gray-700">
                    {{ benefit }}
                  </span>

                </li>

              </ul>

            </div>

            <!-- Quantity -->
            <div class="mb-6">

              <label class="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                Jumlah
              </label>

              <div class="flex items-center gap-3 sm:gap-4">

                <button
                  @click="decrementQuantity"
                  class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-300 hover:border-[#7BA87D] hover:bg-[#7BA87D]/10 flex items-center justify-center"
                >
                  <Minus class="w-4 h-4 sm:w-6 sm:h-6"/>
                </button>

                <span class="text-lg sm:text-xl lg:text-2xl font-semibold min-w-[3rem] sm:min-w-[4rem] text-center">
                  {{ quantity }}
                </span>

                <button
                  @click="incrementQuantity"
                  :disabled="isQtyAtStockLimit"
                  class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 flex items-center justify-center"
                  :class="isQtyAtStockLimit
                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 hover:border-[#7BA87D] hover:bg-[#7BA87D]/10'"
                >
                  <Plus class="w-4 h-4 sm:w-6 sm:h-6"/>
                </button>

              </div>

              <p v-if="isQtyAtStockLimit" class="text-xs text-red-500 mt-2">
                {{ isOutOfStock
                  ? 'Stok habis, tidak bisa tambah ke keranjang.'
                  : 'Qty maksimal untuk ditambahkan sudah tercapai.' }}
              </p>

            </div>

            <!-- Add to cart -->
            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">

              <button
                @click="addToCart"
                :disabled="isOutOfStock"
                class="w-full sm:flex-1 bg-[#7BA87D] hover:bg-[#6A9570]
                  text-white
                  py-3 sm:py-4
                  px-5 sm:px-6
                  rounded-lg
                  text-sm sm:text-base lg:text-lg
                  font-semibold
                  transition-all hover:shadow-lg
                  flex items-center justify-center gap-2"
                :class="isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300 hover:shadow-none' : ''"
              >

                <ShoppingCart class="w-5 h-5 sm:w-6 sm:h-6"/>

                {{ isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang' }}

              </button>

            </div>

          </div>

        </div>

        <!-- Related Products -->
        <div class="mt-12 sm:mt-16">

          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2C4A2F] mb-6 sm:mb-8">
            Produk Terkait
          </h2>

          <div class="grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-4 sm:gap-6 lg:gap-8">

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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/ProductCard.vue'
import { ShoppingCart, Plus, Minus } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const { products, product, getProductById, formatPrice, calculateDiscount } = useProducts()

const quantity = ref(1)

const discount = computed(() =>
  product.value ? calculateDiscount(product.value.price, product.value.originalPrice) : 0
)

const maxStock = computed(() =>
  Number(product.value?.stock || 0)
)

const cartQtyForThisProduct = computed(() => {
  const inCart = cart.items.find(item => item.id === product.value?.id)
  return Number(inCart?.quantity || 0)
})

const availableStockToAdd = computed(() =>
  Math.max(maxStock.value - cartQtyForThisProduct.value, 0)
)

const isOutOfStock = computed(() =>
  availableStockToAdd.value <= 0
)

const isQtyAtStockLimit = computed(() =>
  isOutOfStock.value || quantity.value >= availableStockToAdd.value
)

const relatedProducts = computed(() =>
  products.value
    .filter(p => String(p.id) !== String(route.params.id))
    .slice(0, 3)
)

function incrementQuantity() {
  if (isQtyAtStockLimit.value) return
  quantity.value++
}

function decrementQuantity() {
  if (quantity.value > 1) quantity.value--
}

function addToCart() {
  if (!product.value) return

  if (isOutOfStock.value) return

  const qtyToAdd = Math.min(quantity.value, availableStockToAdd.value)
  for (let i = 0; i < qtyToAdd; i++) {
    cart.addToCart(product.value)
  }
  router.push('/cart')
}

watch([availableStockToAdd, isOutOfStock], () => {
  if (isOutOfStock.value) {
    quantity.value = 1
    return
  }

  if (quantity.value > availableStockToAdd.value) {
    quantity.value = availableStockToAdd.value
  }
}, { immediate: true })

onMounted(() => {
  const product_id = route.params.id
  getProductById(product_id)
})
</script>
