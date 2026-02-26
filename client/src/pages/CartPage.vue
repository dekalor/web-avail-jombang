<template>
  <div class="min-h-screen py-6 sm:py-8 lg:py-12">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

      <!-- Page Header -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C4A2F]">
          Keranjang Belanja
        </h1>
        <p class="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          {{ totalItems }} produk dalam keranjang
        </p>
      </div>

      <!-- Empty Cart -->
      <div v-if="cart.items.length === 0" class="text-center py-12 sm:py-16">
        <div class="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <ShoppingBag class="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24 text-gray-300" />
        </div>

        <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
          Keranjang Anda Kosong
        </h2>

        <p class="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          Mulai belanja dan tambahkan produk ke keranjang
        </p>

        <button
          @click="$router.push('/products')"
          class="bg-[#7BA87D] hover:bg-[#6A9570] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
        >
          Mulai Belanja
        </button>
      </div>

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        <!-- Items -->
        <div class="lg:col-span-2 space-y-4">

          <div
            v-for="item in cart.items"
            :key="item.id"
            class="bg-white rounded-xl shadow-sm p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow"
          >

            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">

              <!-- Image -->
              <div class="w-full sm:w-24 sm:h-24 lg:w-32 lg:h-32 aspect-square flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Details -->
              <div class="flex-1 min-w-0">

                <!-- Name + delete -->
                <div class="flex justify-between items-start gap-2 mb-2">
                  <div class="min-w-0">
                    <h3 class="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 truncate">
                      {{ item.name }}
                    </h3>

                    <p class="text-xs sm:text-sm text-gray-600 mt-1">
                      {{ item.category.name }}
                    </p>
                  </div>

                  <button
                    @click="removeItem(item.id)"
                    class="text-red-500 hover:text-red-700 p-1 sm:p-2 flex-shrink-0"
                  >
                    <Trash2 class="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <!-- Quantity + price -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mt-3 sm:mt-4">

                  <!-- Quantity -->
                  <div class="flex items-center gap-2 sm:gap-3">

                    <button
                      @click="decrementQuantity(item)"
                      class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-gray-300 hover:border-[#7BA87D] hover:bg-[#7BA87D]/10 flex items-center justify-center"
                    >
                      <Minus class="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                    <span class="text-lg sm:text-xl font-semibold min-w-[2.5rem] text-center">
                      {{ item.quantity }}
                    </span>

                    <button
                      @click="incrementQuantity(item)"
                      class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 border-gray-300 hover:border-[#7BA87D] hover:bg-[#7BA87D]/10 flex items-center justify-center"
                    >
                      <Plus class="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>

                  </div>

                  <!-- Price -->
                  <div class="text-left sm:text-right">
                    <div class="text-lg sm:text-xl lg:text-2xl font-bold text-[#7BA87D]">
                      {{ formatPrice(item.price * item.quantity) }}
                    </div>

                    <div class="text-xs sm:text-sm text-gray-500">
                      {{ formatPrice(item.price) }} / item
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">

          <!-- Remove sticky on mobile -->
          <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-24">

            <h2 class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Ringkasan Pesanan
            </h2>

            <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-6">

              <div class="flex justify-between text-sm sm:text-base lg:text-lg">
                <span class="text-gray-600">
                  Subtotal ({{ totalItems }} item)
                </span>
                <span class="font-semibold">
                  {{ formatPrice(subtotal) }}
                </span>
              </div>

              <div
                v-if="discount > 0"
                class="flex justify-between text-sm sm:text-base lg:text-lg text-green-600"
              >
                <span>Diskon</span>
                <span class="font-semibold">
                  -{{ formatPrice(discount) }}
                </span>
              </div>

            </div>

            <div class="border-t pt-4 mb-4 sm:mb-6">
              <div class="flex justify-between items-baseline">
                <span class="text-base sm:text-lg lg:text-xl">
                  Total
                </span>

                <span class="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2C4A2F]">
                  {{ formatPrice(total) }}
                </span>
              </div>
            </div>

            <button
              @click="goToCheckout"
              class="w-full bg-[#7BA87D] hover:bg-[#6A9570] text-white py-3 sm:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold mb-3 sm:mb-4 flex items-center justify-center gap-2"
            >
              Lanjut ke Checkout
              <ArrowRight class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </button>

            <button
              @click="$router.push('/products')"
              class="w-full border-2 border-gray-300 hover:border-[#7BA87D] text-gray-700 hover:text-[#7BA87D] py-2 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg font-semibold"
            >
              Lanjut Belanja
            </button>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useProducts } from '../composables/useProducts'
import { Plus, Minus, ArrowRight, ShoppingBag, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const cart = useCartStore()
const { formatPrice } = useProducts()

const totalItems = computed(() => cart.totalItems)

const subtotal = computed(() =>
  cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const discount = computed(() =>
  cart.items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)
)

const total = computed(() => subtotal.value)

// Methods
function incrementQuantity(item) {
  cart.updateQuantity(item.id, item.quantity + 1)
}

function decrementQuantity(item) {
  if (item.quantity > 1) {
    cart.updateQuantity(item.id, item.quantity - 1)
  }
}

function removeItem(productId) {
  if (confirm('Hapus produk dari keranjang?')) {
    cart.removeFromCart(productId)
  }
}

function goToCheckout() {
  router.push('/checkout')
}
</script>
