<template>
  <div class="bg-[#F5F1E8] min-h-screen py-10 sm:py-12 lg:py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section class="mb-8 sm:mb-10 lg:mb-12">
        <div class="inline-flex items-center rounded-full bg-[#7BA87D]/10 px-4 py-2 mb-4">
          <span class="text-sm sm:text-base font-semibold text-[#2C4A2F]">
            Cerita Pelanggan AVAIL
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C4A2F] leading-tight">
          Testimoni Pengguna
        </h1>
        <p class="mt-3 text-base sm:text-lg text-gray-700 max-w-3xl">
          Kumpulan pengalaman pelanggan kami dalam bentuk foto dan video setelah menggunakan produk AVAIL.
        </p>
      </section>

      <!-- Loading State: Skeleton Cards -->
      <section
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <div
          v-for="n in 6"
          :key="`skeleton-${n}`"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse"
        >
          <div class="aspect-[4/5] bg-gray-200"></div>
          <div class="p-4 sm:p-5 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <div class="h-5 w-36 bg-gray-200 rounded"></div>
              <div class="h-5 w-14 bg-gray-200 rounded-full"></div>
            </div>
            <div class="h-4 w-full bg-gray-200 rounded"></div>
            <div class="h-4 w-4/5 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>

      <!-- Error State -->
      <section
        v-else-if="error"
        class="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm"
      >
        <p class="text-base sm:text-lg text-gray-700 mb-4">{{ error }}</p>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7BA87D] text-white font-medium hover:bg-[#68946a] transition-colors"
          @click="loadTestimonials"
        >
          <RefreshCw class="w-4 h-4" />
          Coba Lagi
        </button>
      </section>

      <!-- Empty State -->
      <section
        v-else-if="testimonials.length === 0"
        class="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm"
      >
        <p class="text-base sm:text-lg text-gray-600">Belum ada testimoni yang ditampilkan saat ini.</p>
      </section>

      <!-- Testimonials Grid -->
      <section
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        <article
          v-for="item in testimonials"
          :key="item.id"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
        >
          <button
            type="button"
            class="w-full text-left"
            @click="openPreview(item)"
          >
            <div class="aspect-[4/5] bg-gray-100 relative">
              <img
                v-if="item.type === 'image'"
                :src="item.mediaUrl"
                :alt="item.title || item.customerName"
                class="w-full h-full object-cover"
                loading="lazy"
              />

              <video
                v-else
                :src="item.mediaUrl"
                class="w-full h-full object-cover"
                muted
                playsinline
              />

              <div
                v-if="item.type === 'video'"
                class="absolute inset-0 flex items-center justify-center bg-black/25"
              >
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                  <Play class="w-6 h-6 sm:w-7 sm:h-7 text-[#2C4A2F]" />
                </div>
              </div>
            </div>
          </button>

          <div class="p-4 sm:p-5">
            <div class="flex items-center justify-between gap-3 mb-2">
              <h2 class="text-lg sm:text-xl font-semibold text-[#2C4A2F] truncate">
                {{ item.customerName }}
              </h2>
              <span class="text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full bg-[#7BA87D]/10 text-[#2C4A2F]">
                {{ item.type === 'video' ? 'Video' : 'Foto' }}
              </span>
            </div>
            <p class="text-sm sm:text-base text-gray-600 line-clamp-3">
              {{ item.caption }}
            </p>
          </div>
        </article>
      </section>
    </div>
  </div>

  <!-- Preview Modal -->
  <div
    v-if="selected"
    class="fixed inset-0 z-50 bg-black/80 p-4 flex items-center justify-center"
    @click="closePreview"
  >
    <div
      class="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl"
      @click.stop
    >
      <div class="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200">
        <div class="min-w-0">
          <p class="text-lg sm:text-xl font-semibold text-[#2C4A2F] truncate">
            {{ selected.customerName }}
          </p>
          <p class="text-sm text-gray-500 truncate">{{ selected.title }}</p>
        </div>
        <button
          type="button"
          @click="closePreview"
          class="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
        >
          <X class="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div class="bg-black">
        <img
          v-if="selected.type === 'image'"
          :src="selected.mediaUrl"
          :alt="selected.title || selected.customerName"
          class="w-full max-h-[75vh] object-contain"
        />
        <video
          v-else
          :src="selected.mediaUrl"
          class="w-full max-h-[75vh]"
          controls
          autoplay
          playsinline
        />
      </div>

      <div class="px-4 sm:px-6 py-4 sm:py-5">
        <p class="text-sm sm:text-base text-gray-700">
          {{ selected.caption }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { Play, X, RefreshCw } from 'lucide-vue-next'
import { useApi } from '../composables/useApi'

const { get } = useApi()

const selected = ref(null)
const testimonials = ref([])
const loading = ref(true)
const error = ref(null)

async function loadTestimonials() {
  loading.value = true
  error.value = null
  const res = await get('/testimonials')
  if (res.success && Array.isArray(res.data)) {
    testimonials.value = res.data
  } else {
    error.value = 'Gagal memuat testimoni pelanggan.'
  }
  loading.value = false
}

function openPreview(item) {
  selected.value = item
}

function closePreview() {
  selected.value = null
}

function handleKeydown(event) {
  if (event.key === 'Escape' && selected.value) {
    closePreview()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  loadTestimonials()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
