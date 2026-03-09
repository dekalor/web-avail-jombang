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

          <!-- Product Gallery -->
          <div class="space-y-3 sm:space-y-4">
            <div class="aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-md sm:shadow-lg lg:shadow-xl border border-gray-100">
              <video
                v-if="isActiveMediaVideo"
                :src="activeMediaUrl"
                class="h-full w-full object-contain p-2 sm:p-3"
                controls
                preload="metadata"
              />
              <img
                v-else
                :src="activeMediaUrl"
                :alt="product.name"
                class="w-full h-full object-contain p-2 sm:p-3 cursor-zoom-in"
                role="button"
                tabindex="0"
                @click="openImageModal"
                @keydown.enter.prevent="openImageModal"
                @keydown.space.prevent="openImageModal"
              />
            </div>

            <div
              v-if="galleryImages.length > 1"
              class="flex gap-2 sm:gap-3 overflow-x-auto pb-1"
            >
              <button
                v-for="(image, index) in galleryImages"
                :key="`${image.mediaUrl}-${index}`"
                type="button"
                @click="selectedImageIndex = index"
                class="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition flex-shrink-0 bg-white"
                :class="selectedImageIndex === index
                  ? 'border-[#7BA87D] ring-2 ring-[#7BA87D]/30'
                  : 'border-gray-200 hover:border-[#7BA87D]/60'"
              >
                <img
                  v-if="image.mediaType !== 'video'"
                  :src="image.mediaUrl"
                  :alt="`${product.name} ${index + 1}`"
                  class="w-full h-full object-contain p-1 bg-white"
                />
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center bg-slate-900 text-white"
                >
                  <span class="rounded bg-black/40 px-2 py-1 text-[10px] font-semibold">VIDEO</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div>

            <!-- Category -->
            <div class="mb-3 sm:mb-4 flex flex-wrap items-center gap-2">
              <span class="inline-block bg-[#7BA87D]/10 text-[#7BA87D]
                px-3 py-1.5 sm:px-4 sm:py-2
                rounded-full
                text-xs sm:text-sm font-semibold">
                {{ product.category.name }}
              </span>

              <span
                v-if="product.badge"
                class="inline-block bg-[#2C4A2F] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm"
              >
                {{ product.badge }}
              </span>
            </div>

            <!-- Title -->
            <h1 class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#2C4A2F] mb-3 sm:mb-4">
              {{ product.name }}
            </h1>

            <!-- Description -->
            <div class="mb-6 sm:mb-7 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Deskripsi Produk
              </h3>

              <p class="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
                {{ displayedDescription }}
              </p>

              <button
                v-if="shouldShowDescriptionToggle"
                type="button"
                class="mt-2 text-sm font-semibold text-[#2C4A2F] hover:text-[#7BA87D]"
                @click="showFullDescription = !showFullDescription"
              >
                {{ showFullDescription ? 'Tampilkan Ringkas' : 'Baca Selengkapnya' }}
              </button>
            </div>

            <!-- Price -->
            <div class="mb-6 sm:mb-8">

              <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                <span class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#7BA87D]">
                  {{ formatPrice(selectedUnitPrice) }}
                </span>
              </div>

            </div>

            <!-- Unit -->
            <div class="mb-6">
              <label class="block text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                Pilih Satuan
              </label>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="unit in availableUnits"
                  :key="unit.id"
                  type="button"
                  @click="selectedUnitCode = unit.unitCode"
                  class="px-4 py-2.5 rounded-full border text-sm sm:text-base font-semibold transition"
                  :class="selectedUnitCode === unit.unitCode
                    ? 'bg-[#7BA87D] border-[#7BA87D] text-white shadow-sm'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-[#7BA87D] hover:text-[#2C4A2F]'"
                >
                  {{ unit.label || unit.unitCode.toUpperCase() }}
                </button>
              </div>

              <p class="text-xs sm:text-sm text-gray-500 mt-2">
                Berat per unit: {{ formatWeight(selectedUnitWeight) }}
              </p>
            </div>

            <!-- Benefits -->
            <!-- <div class="mb-6 sm:mb-8">

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

            </div> -->

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

      </div>

      <MediaModal
        v-if="isImageModalOpen && modalImageUrl"
        :type="selectedMedia.mediaType"
        :media-url="modalImageUrl"
        :title="product?.name || 'Detail Produk'"
        :on-close="closeImageModal"
        :on-next="imageOnlyMedia.length > 1 ? nextImage : undefined"
        :on-previous="imageOnlyMedia.length > 1 ? prevImage : undefined"
      />

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useProducts } from '../composables/useProducts'
import { ShoppingCart, Plus, Minus } from 'lucide-vue-next'
import MediaModal from '../components/MediaModal.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const { product, getProductById, formatPrice, formatWeight } = useProducts()

const quantity = ref(1)
const selectedUnitCode = ref('')
const selectedImageIndex = ref(0)
const showFullDescription = ref(false)
const isImageModalOpen = ref(false)
const modalImageIndex = ref(0)

const DESCRIPTION_PREVIEW_LIMIT = 180

const availableUnits = computed(() => {
  const units = Array.isArray(product.value?.units) ? [...product.value.units] : []
  return units.sort((a, b) => Number(a.id || 0) - Number(b.id || 0))
})

const selectedUnit = computed(() => {
  if (!availableUnits.value.length) return null
  return availableUnits.value.find(unit => unit.unitCode === selectedUnitCode.value)
    || availableUnits.value.find(unit => unit.unitCode === product.value?.unitCode)
    || availableUnits.value[0]
})

const selectedUnitPrice = computed(() =>
  Number(selectedUnit.value?.price || product.value?.price || 0)
)

const selectedUnitWeight = computed(() =>
  Number(selectedUnit.value?.weight || product.value?.weight || 0)
)

const selectedQtyPerUnit = computed(() =>
  Number(selectedUnit.value?.qtyPerUnit || 1)
)

const galleryImages = computed(() => {
  if (!product.value) return []

  const parsed = []
  const { imageUrl } = product.value

  if (imageUrl) {
    parsed.push({
      mediaType: 'image',
      mediaUrl: imageUrl,
      sortOrder: 0,
    })
  }

  const detailMedia = Array.isArray(product.value.detailMedia)
    ? [...product.value.detailMedia]
    : []
  detailMedia
    .sort((a, b) =>
      Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
      || Number(a.id || 0) - Number(b.id || 0))
    .forEach((item) => {
      const mediaUrl = String(item.mediaUrl || '').trim()
      if (!mediaUrl) return
      parsed.push({
        mediaType: item.mediaType === 'video' ? 'video' : 'image',
        mediaUrl,
        sortOrder: Number(item.sortOrder || 0),
      })
    })

  const seen = new Set()
  return parsed.filter((item) => {
    if (!item?.mediaUrl || seen.has(item.mediaUrl)) return false
    seen.add(item.mediaUrl)
    return true
  })
})

const selectedMedia = computed(() =>
  galleryImages.value[selectedImageIndex.value] || null
)

const activeMediaUrl = computed(() =>
  selectedMedia.value?.mediaUrl || product.value?.imageUrl || ''
)

const isActiveMediaVideo = computed(() =>
  selectedMedia.value?.mediaType === 'video'
)

const imageOnlyMedia = computed(() =>
  galleryImages.value.filter((item) => item.mediaType !== 'video')
)

const modalImageUrl = computed(() =>
  imageOnlyMedia.value[modalImageIndex.value]?.mediaUrl || ''
)

const fullDescription = computed(() =>
  String(product.value?.description || '').trim()
)

const shouldShowDescriptionToggle = computed(() =>
  fullDescription.value.length > DESCRIPTION_PREVIEW_LIMIT
)

const displayedDescription = computed(() => {
  if (!fullDescription.value) return '-'
  if (showFullDescription.value || !shouldShowDescriptionToggle.value) {
    return fullDescription.value
  }
  return `${fullDescription.value.slice(0, DESCRIPTION_PREVIEW_LIMIT)}...`
})

const maxStock = computed(() =>
  Number(product.value?.stock || 0)
)

const cartQtyForThisProduct = computed(() => {
  if (!product.value?.id) return 0
  return cart.items
    .filter(item => item.id === product.value.id && item.unitCode === selectedUnitCode.value)
    .reduce((sum, item) => sum + Number(item.quantity || 0), 0)
})

const availableStockToAdd = computed(() =>
  Math.max(
    Math.floor(maxStock.value / selectedQtyPerUnit.value) - cartQtyForThisProduct.value,
    0
  )
)

const isOutOfStock = computed(() =>
  availableStockToAdd.value <= 0
)

const isQtyAtStockLimit = computed(() =>
  isOutOfStock.value || quantity.value >= availableStockToAdd.value
)

function openImageModal() {
  if (!activeMediaUrl.value || isActiveMediaVideo.value) return
  const activeImageIdx = imageOnlyMedia.value.findIndex((item) => item.mediaUrl === activeMediaUrl.value)
  modalImageIndex.value = activeImageIdx >= 0 ? activeImageIdx : 0
  isImageModalOpen.value = true
}

function closeImageModal() {
  isImageModalOpen.value = false
}

function nextImage() {
  if (!imageOnlyMedia.value.length) return
  modalImageIndex.value = (modalImageIndex.value + 1) % imageOnlyMedia.value.length
}

function prevImage() {
  if (!imageOnlyMedia.value.length) return
  modalImageIndex.value = (modalImageIndex.value - 1 + imageOnlyMedia.value.length) % imageOnlyMedia.value.length
}

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
    cart.addToCart(product.value, selectedUnitCode.value)
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

watch(product, (value) => {
  if (!value) return
  const units = Array.isArray(value.units) ? value.units : []
  if (!units.length) return

  const preferred = units.find(unit => unit.unitCode === value.unitCode)
  selectedUnitCode.value = preferred?.unitCode || units[0].unitCode
  selectedImageIndex.value = 0
  showFullDescription.value = false
  isImageModalOpen.value = false
  modalImageIndex.value = 0
}, { immediate: true })
</script>
