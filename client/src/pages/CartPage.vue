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
            :key="item.cartKey"
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

                    <p class="text-xs sm:text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                      <Weight class="w-4 h-4 sm:w-5 sm:h-5" />
                      {{ formatWeight(item.weight * item.quantity) }}
                    </p>

                    <div class="mt-2 flex flex-wrap gap-2">
                      <button
                        v-for="unit in item.units || []"
                        :key="unit.id"
                        type="button"
                        @click="handleUnitChange(item, unit.unitCode)"
                        class="px-2.5 py-1 rounded-full border text-xs font-semibold transition"
                        :class="item.unitCode === unit.unitCode
                          ? 'bg-[#7BA87D] border-[#7BA87D] text-white'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-[#7BA87D] hover:text-[#2C4A2F]'"
                      >
                        {{ unit.label || unit.unitCode.toUpperCase() }}
                      </button>
                    </div>
                  </div>

                  <button
                    @click="openRemoveConfirm(item)"
                    class="text-red-500 hover:text-red-700 p-1 sm:p-2 flex-shrink-0"
                  >
                    <Trash2 class="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <!-- Quantity + price -->
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mt-3 sm:mt-4">

                  <!-- Quantity -->
                  <div>
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
                        :disabled="isQtyAtStockLimit(item)"
                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 flex items-center justify-center"
                        :class="isQtyAtStockLimit(item)
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-[#7BA87D] hover:bg-[#7BA87D]/10'"
                      >
                        <Plus class="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>

                    </div>

                    <p v-if="isQtyAtStockLimit(item)" class="text-xs text-red-500 mt-2">
                      Stok habis, tidak bisa tambah ke keranjang.
                    </p>

                  </div>

                  <!-- Price -->
                  <div class="text-left sm:text-right">
                    <div class="text-lg sm:text-xl lg:text-2xl font-bold text-[#7BA87D]">
                      {{ formatPrice(item.price * item.quantity) }}
                    </div>

                    <div class="text-xs sm:text-sm text-gray-500">
                      {{ formatPrice(item.price) }} / {{ item.unitLabel || item.unitCode?.toUpperCase() || 'unit' }}
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

    <div
      v-if="removeConfirm.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      @click.self="closeRemoveConfirm"
    >
      <div class="w-full max-w-md rounded-xl bg-white p-5 sm:p-6 shadow-xl">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Hapus Produk?
        </h3>
        <p class="text-sm sm:text-base text-gray-600 mb-5">
          Produk <span class="font-semibold text-gray-800">"{{ removeConfirm.itemName }}"</span> akan dihapus dari keranjang.
        </p>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
          <button
            type="button"
            class="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            @click="closeRemoveConfirm"
          >
            Batal
          </button>
          <button
            type="button"
            class="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            @click="confirmRemoveItem"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useProducts } from '../composables/useProducts'
import { Plus, Minus, ArrowRight, ShoppingBag, Trash2, Weight } from 'lucide-vue-next'

const router = useRouter()
const cart = useCartStore()
const { formatPrice, formatWeight } = useProducts()

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
const removeConfirm = ref({
  open: false,
  cartKey: null,
  itemName: '',
})

// Methods
function incrementQuantity(item) {
  if (isQtyAtStockLimit(item)) return
  cart.updateQuantity(item.cartKey, item.quantity + 1)
}

function decrementQuantity(item) {
  if (item.quantity > 1) {
    cart.updateQuantity(item.cartKey, item.quantity - 1)
  }
}

function openRemoveConfirm(item) {
  removeConfirm.value = {
    open: true,
    cartKey: item.cartKey,
    itemName: item.name,
  }
}

function closeRemoveConfirm() {
  removeConfirm.value = {
    open: false,
    cartKey: null,
    itemName: '',
  }
}

function confirmRemoveItem() {
  if (removeConfirm.value.cartKey) {
    cart.removeFromCart(removeConfirm.value.cartKey)
  }
  closeRemoveConfirm()
}

function goToCheckout() {
  router.push('/checkout')
}

function isQtyAtStockLimit(item) {
  const stockPcs = Number(item.stock || 0)
  const qtyPerUnit = Number(item.qtyPerUnit || 1)
  const maxQty = qtyPerUnit > 0 ? Math.floor(stockPcs / qtyPerUnit) : 0
  if (maxQty <= 0) return true
  return item.quantity >= maxQty
}

async function handleUnitChange(item, nextUnitCode) {
  await cart.updateItemUnit(item.cartKey, nextUnitCode)
}
</script>
