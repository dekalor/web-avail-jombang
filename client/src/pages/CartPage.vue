<template>
  <div class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-[#2C4A2F]">Keranjang Belanja</h1>
        <p class="text-gray-600 mt-2">{{ totalItems }} produk dalam keranjang</p>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cart.items.length === 0" class="text-center py-16">
        <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag class="w-24 h-24 text-gray-300 mx-auto mb-6" />
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">
          Keranjang Anda Kosong
        </h2>
        <p class="text-gray-600 mb-6">
          Mulai belanja dan tambahkan produk ke keranjang
        </p>
        <button @click="$router.push('/products')"
          class="bg-[#7BA87D] hover:bg-[#6A9570] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
          Mulai Belanja
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="item in cart.items" :key="item.id"
            class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div class="flex gap-6">
              <!-- Product Image -->
              <div class="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover" />
              </div>

              <!-- Product Details -->
              <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900">
                      {{ item.name }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ item.category.name }}
                    </p>
                  </div>
                  <button @click="removeItem(item.id)" class="text-red-500 hover:text-red-700 p-2"
                    title="Hapus dari keranjang">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>

                <div class="flex justify-between items-end mt-4">
                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-3">
                    <button @click="decrementQuantity(item)"
                      class="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#7BA87D] hover:bg-[#7BA87D]/10 transition-colors flex items-center justify-center">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span class="text-xl font-semibold min-w-[3rem] text-center">
                      {{ item.quantity }}
                    </span>
                    <button @click="incrementQuantity(item)"
                      class="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#7BA87D] hover:bg-[#7BA87D]/10 transition-colors flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <!-- Price -->
                  <div class="text-right">
                    <div class="text-2xl font-bold text-[#7BA87D]">
                      {{ formatPrice(item.price * item.quantity) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ formatPrice(item.price) }} / item
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary (Sticky) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">
              Ringkasan Pesanan
            </h2>

            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-lg">
                <span class="text-gray-600">Subtotal ({{ totalItems }} item)</span>
                <span class="font-semibold">{{ formatPrice(subtotal) }}</span>
              </div>

              <div v-if="discount > 0" class="flex justify-between text-lg text-green-600">
                <span>Diskon</span>
                <span class="font-semibold">-{{ formatPrice(discount) }}</span>
              </div>
            </div>

            <div class="border-t pt-4 mb-6">
              <div class="flex justify-between items-baseline">
                <span class="text-xl text-gray-900">Total</span>
                <span class="text-3xl font-bold text-[#2C4A2F]">
                  {{ formatPrice(total) }}
                </span>
              </div>
            </div>

            <button @click="goToCheckout"
              class="w-full bg-[#7BA87D] hover:bg-[#6A9570] text-white py-4 rounded-lg text-lg font-semibold transition-colors mb-4 flex items-center justify-center gap-2">
              <span>Lanjut ke Checkout</span>
              <ArrowRight class="w-6 h-6" />
            </button>

            <button @click="$router.push('/products')"
              class="w-full border-2 border-gray-300 hover:border-[#7BA87D] text-gray-700 hover:text-[#7BA87D] py-3 rounded-lg text-lg font-semibold transition-colors">
              Lanjut Belanja
            </button>

            <!-- Trust Badges -->
            <div class="mt-6 pt-6 border-t space-y-3">
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"></path>
                </svg>
                <span>Pembayaran Aman & Terpercaya</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-600">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"></path>
                </svg>
                <span>Garansi Uang Kembali</span>
              </div>
            </div>
          </div>
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
