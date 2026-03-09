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

      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                :alt="item.title"
                class="w-full h-full object-cover"
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
          :alt="selected.title"
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
import { Play, X } from 'lucide-vue-next'

const selected = ref(null)

const testimonials = [
  {
    id: 1,
    type: 'image',
    customerName: 'Kristiani Apu',
    title: 'Ulasan pelanggan',
    caption: 'Mengidap Mioma sampai hampir angkat rahim & sembuh setelah pakai FC Sanitary Pad',
    mediaUrl: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946816/Testimonial_1_gdk0cs.jpg',
  },
  {
    id: 2,
    type: 'image',
    customerName: 'Siti Masruroh',
    title: 'Ulasan pelanggan',
    caption: 'Menstruasi tidak lancar karena PCOS kini kembali normal',
    mediaUrl: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946816/Testimonial_2_m0xpmp.jpg',
  },
  {
    id: 3,
    type: 'video',
    customerName: 'Konsumen',
    title: 'Cerita pengalaman',
    caption: 'Istri dan anak-anak nya sering konsultasi ke dokter masalah kewanitaan, setelah pakai FC Sanitary Pad sudah tidak pernah ke dokter lagi',
    mediaUrl: 'https://res.cloudinary.com/drp8mahwc/video/upload/v1772946819/Testimonial_3_y3itsb.mp4',
  },
  {
    id: 4,
    type: 'image',
    customerName: 'Selebriti Indonesia',
    title: 'Cerita pengalaman',
    caption: 'Para selebriti yang menggunakan AVAIL sehari-hari (bukan endorse)',
    mediaUrl: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946816/Testimonial_4_dq3uso.jpg',
  },
  {
    id: 5,
    type: 'video',
    customerName: 'Ahan Suryadi - Garut',
    title: 'Cerita pengalaman',
    caption: 'Karena pernah operasi dan radiasi di kepala mengakibatkan aktifitas seksual kurang maksimal, setelah mengkonsumsi AVAIL A Cafe aktifitas seksual bisa kembali maksimal',
    mediaUrl: 'https://res.cloudinary.com/drp8mahwc/video/upload/v1772946824/Testimonial_5_rgrdna.mp4',
  },
  {
    id: 6,
    type: 'image',
    customerName: 'Syifatun - Trenggalek',
    title: 'Ulasan pelanggan',
    caption: 'Gangguan lambung membaik setelah mengkonsumsi Nutrashake',
    mediaUrl: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946820/Testimonial_6_kpacsq.jpg',
  },
  {
    id: 7,
    type: 'video',
    customerName: 'Sari - Nutrisionis Avail',
    title: 'Ulasan pelanggan',
    caption: 'Pernah tau Gerd ya? Penyakit lambung.. Apakah nutrashake bisa menjadi solusi bagi orang-orang yg bermasalah dengan lambung.. kebetulan saya tanya sama Mbak Sari. Mbak Sari ini tandem nya Dr.Erina (dokter AVAIL) sebagai nutrisionis AVAIL. Sangat sangat mempuni Lulusan UI.',
    mediaUrl: 'https://res.cloudinary.com/drp8mahwc/video/upload/v1772946823/Testimonial_7_li7no1.mp4',
  },
  {
    id: 8,
    type: 'image',
    customerName: 'Anisa Prasasti',
    title: 'Ulasan pelanggan',
    caption: 'Nutrashake hempas kolesterol',
    mediaUrl: 'https://res.cloudinary.com/drp8mahwc/image/upload/v1772946823/Testimonial_8_mnqi7b.jpg',
  },
]

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
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>
