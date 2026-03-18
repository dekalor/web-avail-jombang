<template>
  <div class="bg-[#F5F1E8]">
    <!-- Hero Section -->
    <section class="py-10 sm:py-14 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <!-- Hero Content -->
          <div class="reveal-on-scroll">
            <div class="inline-block bg-[#7BA87D]/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <span class="text-[#7BA87D] text-sm sm:text-base lg:text-lg font-semibold">
                ✨ Produk Herbal Terpercaya
              </span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-6xl font-bold text-[#2C4A2F] mb-4 sm:mb-6 leading-tight">
              Kenyamanan Alami,<br />
              Khusus untuk Anda
            </h1>

            <p class="text-base sm:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              <em>AVAIL BIO Sanitary Pad</em>
              merupakan pilihan terbaik untuk pembalut wanita. <em>AVAIL</em> dibuat dari kapas yang mengandung
              herbal dan antiseptik alami, bebas dari bahan-bahan kimia berbahaya.
            </p>

            <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
              <button @click="$router.push('/products')"
                class="w-full sm:w-auto bg-[#7BA87D] hover:bg-[#6A9570] text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg cursor-pointer">
                Lihat Produk
                <ArrowRight class="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                @click="scrollToGallery"
                class="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#2C4A2F] border-2 border-[#2C4A2F]/20 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              >
                Pelajari Lebih Lanjut
                <ArrowDown class="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="relative reveal-on-scroll" data-delay="120">
            <div class="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img src="../assets/images/Home.jpeg" alt="AVAIL Product" class="w-full h-full object-cover" />
            </div>

            <!-- Floating Badge -->
            <div class="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 bg-white rounded-2xl shadow-xl p-4 sm:p-6">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="w-11 h-11 sm:w-14 sm:h-14 bg-[#7BA87D] rounded-full flex items-center justify-center">
                  <Award class="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <p class="text-lg sm:text-2xl font-bold text-[#2C4A2F]">100%</p>
                  <p class="text-sm sm:text-base text-gray-600">Herbal Alami</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-10 sm:py-14 lg:py-16 bg-white reveal-on-scroll">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C4A2F] mb-3 sm:mb-4">
            Manfaat Produk AVAIL
          </h2>
          <p class="text-base sm:text-lg lg:text-xl text-gray-600">
            Dipercaya ribuan keluarga Indonesia
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div class="p-5 sm:p-6 lg:p-8 text-center hover:shadow-lg transition-shadow rounded-2xl border border-gray-100 reveal-on-scroll" data-delay="40">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#7BA87D]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Leaf class="w-8 h-8 sm:w-10 sm:h-10 text-[#7BA87D]" />
            </div>
            <h3 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
              100% Bahan Alami
            </h3>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Diformulasikan dari bahan herbal pilihan tanpa bahan kimia berbahaya
            </p>
          </div>

          <div class="p-5 sm:p-6 lg:p-8 text-center hover:shadow-lg transition-shadow rounded-2xl border border-gray-100 reveal-on-scroll" data-delay="90">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#7BA87D]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Shield class="w-8 h-8 sm:w-10 sm:h-10 text-[#7BA87D]" />
            </div>
            <h3 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Teruji Klinis
            </h3>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Telah melalui uji klinis dan terdaftar di BPOM RI
            </p>
          </div>

          <div class="p-5 sm:p-6 lg:p-8 text-center hover:shadow-lg transition-shadow rounded-2xl border border-gray-100 sm:col-span-2 lg:col-span-1 reveal-on-scroll" data-delay="140">
            <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#7BA87D]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Zap class="w-8 h-8 sm:w-10 sm:h-10 text-[#7BA87D]" />
            </div>
            <h3 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Hasil Nyata
            </h3>
            <p class="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Ribuan pelanggan telah merasakan manfaatnya
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-10 sm:py-14 lg:py-16 reveal-on-scroll">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C4A2F] mb-3 sm:mb-4">
            Produk Terlaris
          </h2>
          <p class="text-base sm:text-lg lg:text-xl text-gray-600">
            Pilihan terbaik untuk kesehatan Anda
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div
            v-for="(product, index) in featuredProducts"
            :key="product.id"
            class="reveal-on-scroll"
            :data-delay="String(index * 70)"
          >
            <ProductCard :product="product" />
          </div>
        </div>

        <div class="text-center mt-8 sm:mt-10 lg:mt-12">
          <button @click="$router.push('/products')"
            class="w-full sm:w-auto bg-[#7BA87D] hover:bg-[#6A9570] text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all hover:shadow-lg cursor-pointer">
            Lihat Semua Produk
          </button>
        </div>
      </div>
    </section>

    <!-- WhatsApp Quick Order Section -->
    <section class="py-10 sm:py-14 lg:py-16 bg-white reveal-on-scroll">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-[#7BA87D] rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl reveal-on-scroll">
          <div class="flex flex-col lg:flex-row items-center gap-8">

            <div class="text-center lg:text-left text-white flex-1">
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Pesan Lebih Mudah via WhatsApp!
              </h2>
              <p class="text-base sm:text-lg lg:text-xl mb-6 text-white/90">
                Konsultasi gratis dan pesan langsung dengan admin kami.
                Respon cepat dan pelayanan ramah untuk Anda.
              </p>
              <a href="https://wa.me/6281332224169?text=Halo%20AVAIL%20Jombang,%20saya%20ingin%20bertanya%20tentang%20produk-produk%20Avail"
                target="_blank" rel="noopener noreferrer"
                class="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-white text-[#7BA87D] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-5 rounded-2xl text-base sm:text-xl font-semibold transition-all hover:scale-105 shadow-lg">
                <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Mulai Chat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Galery Avail Tips n Benefit -->
    <section id="gallery-avail-tips-benefit" class="py-10 sm:py-14 lg:py-16 reveal-on-scroll">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 class="text-2xl md:text-4xl font-bold text-[#2C4A2F] mb-4">
            Lihat Tips & Manfaat AVAIL
          </h2>
          <p class="text-base md:text-xl text-gray-600">
            Temukan bagaimana kandungan herbal pada pembalut membantu memberikan perlindungan alami serta menjaga kenyamanan sepanjang hari.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div v-for="(media, index) in galleryMedias" :key="media.url"
            class="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer reveal-on-scroll"
            :data-delay="String((index % 3) * 70)"
            @click="selectedMediaIndex = index">
            <img v-if="media.type === 'image'"
              :src="media.url" :alt="media.alt"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />

            <video
                v-else
                :src="media.url"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                muted
                playsinline
              />
            <div
                v-if="media.type === 'video'"
                class="absolute inset-0 flex items-center justify-center bg-black/25"
              >
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                  <Play class="w-6 h-6 sm:w-7 sm:h-7 text-[#2C4A2F]" />
                </div>
              </div>
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="absolute bottom-4 left-4 right-4">
                <p class="text-white text-sm md:text-lg font-semibold">{{ media.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials CTA -->
    <section class="py-10 sm:py-14 lg:py-16 bg-white reveal-on-scroll">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-[#7BA87D] rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl reveal-on-scroll">
          <div class="flex flex-col lg:flex-row items-center gap-8">

            <div class="text-center lg:text-left text-white flex-1">
              <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Bukti Nyata dari Pengguna AVAIL
              </h2>
              <p class="text-base sm:text-lg lg:text-xl mb-6 text-white/90">
                Lihat foto dan video pengalaman pelanggan yang sudah merasakan manfaatnya.
              </p>
              <button
                @click="$router.push('/testimonials')"
                class="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-white text-[#7BA87D] hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-5 rounded-2xl text-base sm:text-xl font-semibold transition-all hover:scale-105 shadow-lg"
              >
                Lihat Semua Testimoni
                <ArrowRight/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Media Modal -->
    <MediaModal v-if="selectedMediaIndex !== null" 
      :type="galleryMedias[selectedMediaIndex].type"
      :mediaUrl="galleryMedias[selectedMediaIndex].url"
      :title="galleryMedias[selectedMediaIndex].title"
      :onNext="() => selectedMediaIndex = (selectedMediaIndex + 1) % galleryMedias.length"
      :onPrevious="() => selectedMediaIndex = (selectedMediaIndex - 1 + galleryMedias.length) % galleryMedias.length"
      :onClose="() => selectedMediaIndex = null" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProducts } from '../composables/useProducts'
import { ArrowDown, ArrowRight, Award, Leaf, Shield, Zap, Play } from 'lucide-vue-next'
import MediaModal from '../components/MediaModal.vue';

const { loadFeaturedProducts, featuredProducts } = useProducts()

const selectedMediaIndex = ref(null);
let revealObserver = null

const galleryMedias = [
  {
    type: "video",
    url: "https://res.cloudinary.com/drp8mahwc/video/upload/v1773026536/CompanyProfile.mp4",
    title: "Informasi",
    alt: "Informasi"
  },  
  {
    type: "image",
    url: "https://res.cloudinary.com/drp8mahwc/image/upload/v1773041988/Materi_1_nojtk3.jpg",
    title: "Informasi",
    alt: "Informasi"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/drp8mahwc/image/upload/v1773041988/Materi_2_kwdicw.jpg",
    title: "Informasi",
    alt: "Informasi"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/drp8mahwc/image/upload/v1773041988/Materi_3_y8emkj.jpg",
    title: "Tips",
    alt: "Tips"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/drp8mahwc/image/upload/v1773041988/Materi_4_cevoe8.jpg",
    title: "Tips",
    alt: "Tips"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/drp8mahwc/image/upload/v1773041989/Materi_5_d1trcn.jpg",
    title: "Tips",
    alt: "Tips"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/drp8mahwc/image/upload/v1773041989/Materi_6_qmkwwy.jpg",
    title: "Tips",
    alt: "Tips"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/drp8mahwc/image/upload/v1773041988/Materi_7_uja0zp.jpg",
    title: "Tips",
    alt: "Tips"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/drp8mahwc/image/upload/v1773041988/Materi_8_wcod1n.jpg",
    title: "Tips",
    alt: "Tips"
  },
  {
    type: "image",
    url: "https://res.cloudinary.com/drp8mahwc/image/upload/v1773041989/Materi_9_m5h3di.jpg",
    title: "Informasi",
    alt: "Informasi"
  },
];

onMounted(async () => {
  await loadFeaturedProducts(3)
  await nextTick()
  initScrollReveal()
})

onUnmounted(() => {
  if (revealObserver) {
    revealObserver.disconnect()
    revealObserver = null
  }
})

function scrollToGallery() {
  const section = document.getElementById('gallery-avail-tips-benefit')
  if (!section) return

  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function initScrollReveal() {
  const nodes = Array.from(document.querySelectorAll('.reveal-on-scroll'))
  if (!nodes.length) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    nodes.forEach((node) => node.classList.add('is-visible'))
    return
  }

  revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const delay = Number(entry.target.dataset.delay || 0)
      entry.target.style.transitionDelay = `${delay}ms`
      entry.target.classList.add('is-visible')
      revealObserver.unobserve(entry.target)
    }
  }, {
    threshold: 0.14,
    rootMargin: '0px 0px -8% 0px',
  })

  nodes.forEach((node) => revealObserver.observe(node))
}
</script>

<style scoped>
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 560ms ease, transform 560ms ease;
  will-change: opacity, transform;
}

.reveal-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal-on-scroll {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
