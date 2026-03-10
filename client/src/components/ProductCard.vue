<template>
  <div
    class="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col bg-white rounded-xl cursor-pointer"
    @click="goToProductDetail"
  >

      <!-- Image -->
      <div class="relative aspect-square overflow-hidden bg-white">
        <div
          v-if="product.badge"
          class="absolute left-3 top-3 z-10 rounded-full bg-[#2C4A2F] px-3 py-1 text-xs font-semibold text-white shadow-sm"
        >
          {{ product.badge }}
        </div>

        <img
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-contain"
        />
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
            <span class="text-2xl font-bold text-[#7BA87D]">
              {{ formatPrice(selectedUnitPrice) }}
            </span>
          </div>

          <div class="mb-4">
            <p class="text-xs text-gray-500 mb-2">Pilih satuan</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="unit in availableUnits"
                :key="unit.id"
                type="button"
                @click.stop="selectedUnitCode = unit.unitCode"
                class="px-3 py-1.5 rounded-full border text-xs font-semibold transition"
                :class="selectedUnitCode === unit.unitCode
                  ? 'bg-[#7BA87D] border-[#7BA87D] text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-[#7BA87D] hover:text-[#2C4A2F]'"
              >
                {{ unit.label || unit.unitCode.toUpperCase() }}
              </button>
            </div>
          </div>


          <!-- Button -->
          <button
            @click="handleAddToCart"
            :disabled="isQtyAtStockLimit"
            :class="[
              'w-full text-lg py-3 rounded-lg flex items-center justify-center gap-2 transition-all',

              isAdded
                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                : isQtyAtStockLimit
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#7BA87D] hover:bg-[#6A9570] text-white cursor-pointer'
            ]"
          >

            <!-- Check icon -->
            <Check v-if="isAdded" class="w-5 h-5" />

            <!-- Cart icon -->
            <ShoppingCart v-else class="w-5 h-5" />
            
            {{ isOutOfStock ? 'Stok Habis' : isAdded ? 'Ditambahkan!' : 'Tambah ke Keranjang' }}

          </button>

          <p v-if="!isOutOfStock && isQtyAtStockLimit" class="text-xs text-red-500 mt-2">
            Qty sudah di batas stok ({{ maxQtyForSelectedUnit }}).
          </p>

        </div>

      </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useProducts } from '../composables/useProducts'
import { ShoppingCart, Check } from 'lucide-vue-next'

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
const selectedUnitCode = ref('')

const { formatPrice } = useProducts()

const availableUnits = computed(() =>
  Array.isArray(props.product?.units) ? props.product.units : []
)

const selectedUnit = computed(() => {
  if (!availableUnits.value.length) return null
  return availableUnits.value.find(unit => unit.unitCode === selectedUnitCode.value)
    || availableUnits.value.find(unit => unit.unitCode === props.product?.unitCode)
    || availableUnits.value[0]
})

const selectedUnitPrice = computed(() =>
  Number(selectedUnit.value?.price || props.product.price || 0)
)

const selectedQtyPerUnit = computed(() =>
  Number(selectedUnit.value?.qtyPerUnit || 1)
)

const cartQtyForSelectedUnit = computed(() =>
  cart.items
    .filter(item => item.id === props.product.id && item.unitCode === selectedUnitCode.value)
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0)
)

const maxQtyForSelectedUnit = computed(() =>
  cart.availableQtyForUnit({
    product: props.product,
    unitCode: selectedUnitCode.value,
    qtyPerUnit: selectedQtyPerUnit.value,
  })
)

const isOutOfStock = computed(() =>
  maxQtyForSelectedUnit.value <= 0
)

const isQtyAtStockLimit = computed(() => {
  if (maxQtyForSelectedUnit.value <= 0) return true
  return cartQtyForSelectedUnit.value >= maxQtyForSelectedUnit.value
})

function handleAddToCart(event) {
  event.stopPropagation()
  event.preventDefault()

  if (isQtyAtStockLimit.value) return

  cart.addToCart(props.product, selectedUnitCode.value)
  isAdded.value = true

  setTimeout(() => {
    isAdded.value = false
  }, 2000)
}

function goToProductDetail() {
  router.push(`/products/${props.product.id}`)
}

watch(() => props.product, (value) => {
  const units = Array.isArray(value?.units) ? value.units : []
  if (!units.length) return

  const preferred = units.find(unit => unit.unitCode === value.unitCode)
  selectedUnitCode.value = preferred?.unitCode || units[0].unitCode
}, { immediate: true, deep: true })
</script>
