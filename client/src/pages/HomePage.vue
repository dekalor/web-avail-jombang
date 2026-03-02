<template>
  <div class="bg-[#F5F1E8]">
    <!-- Hero Section -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Hero Content -->
          <div>
            <div class="inline-block bg-[#7BA87D]/10 px-4 py-2 rounded-full mb-6">
              <span class="text-[#7BA87D] text-lg font-semibold">
                ✨ Produk Herbal Terpercaya
              </span>
            </div>

            <h1 class="text-5xl lg:text-6xl font-bold text-[#2C4A2F] mb-6 leading-tight">
              Kenyamanan Alami,<br />
              Khusus untuk Anda
            </h1>

            <p class="text-xl text-gray-700 mb-8 leading-relaxed">
              <em>AVAIL BIO Sanitary Pad</em>
              merupakan pilihan terbaik untuk pembalut wanita. <em>AVAIL</em> dibuat dari kapas yang mengandung
              herbal dan antiseptik alami, bebas dari bahan-bahan kimia berbahaya.
            </p>

            <div class="flex flex-wrap gap-4">
              <button @click="$router.push('/products')"
                class="bg-[#7BA87D] hover:bg-[#6A9570] text-white text-xl px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all hover:shadow-lg cursor-pointer">
                Lihat Produk
                <ArrowRight class="w-6 h-6" />
              </button>
              <button
                type="button"
                @click="scrollToGallery"
                class="bg-white hover:bg-gray-50 text-[#2C4A2F] border-2 border-[#2C4A2F]/20 text-xl px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all hover:shadow-lg"
              >
                Pelajari Lebih Lanjut
                <ArrowDown class="w-6 h-6" />
              </button>
            </div>
          </div>

          <!-- Hero Image -->
          <div class="relative">
            <div class="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img src="../assets/images/Home.jpeg" alt="AVAIL Product" class="w-full h-full object-cover" />
            </div>

            <!-- Floating Badge -->
            <div class="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-[#7BA87D] rounded-full flex items-center justify-center">
                  <Award class="w-8 h-8 text-white" />
                </div>
                <div>
                  <p class="text-2xl font-bold text-[#2C4A2F]">100%</p>
                  <p class="text-base text-gray-600">Herbal Alami</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-[#2C4A2F] mb-4">
            Manfaat Produk AVAIL
          </h2>
          <p class="text-xl text-gray-600">
            Dipercaya ribuan keluarga Indonesia
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="p-8 text-center hover:shadow-lg transition-shadow rounded-2xl border border-gray-100">
            <div class="w-20 h-20 bg-[#7BA87D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf class="w-10 h-10 text-[#7BA87D]" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-3">
              100% Bahan Alami
            </h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              Diformulasikan dari bahan herbal pilihan tanpa bahan kimia berbahaya
            </p>
          </div>

          <div class="p-8 text-center hover:shadow-lg transition-shadow rounded-2xl border border-gray-100">
            <div class="w-20 h-20 bg-[#7BA87D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield class="w-10 h-10 text-[#7BA87D]" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-3">
              Teruji Klinis
            </h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              Telah melalui uji klinis dan terdaftar di BPOM RI
            </p>
          </div>

          <div class="p-8 text-center hover:shadow-lg transition-shadow rounded-2xl border border-gray-100">
            <div class="w-20 h-20 bg-[#7BA87D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap class="w-10 h-10 text-[#7BA87D]" />
            </div>
            <h3 class="text-2xl font-semibold text-gray-900 mb-3">
              Hasil Nyata
            </h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              Ribuan pelanggan telah merasakan manfaatnya
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-[#2C4A2F] mb-4">
            Produk Terlaris
          </h2>
          <p class="text-xl text-gray-600">
            Pilihan terbaik untuk kesehatan Anda
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
        </div>

        <div class="text-center mt-12">
          <button @click="$router.push('/products')"
            class="bg-[#7BA87D] hover:bg-[#6A9570] text-white text-lg px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-lg cursor-pointer">
            Lihat Semua Produk
          </button>
        </div>
      </div>
    </section>

    <!-- WhatsApp Quick Order Section -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-[#7BA87D] rounded-3xl p-8 lg:p-12 shadow-2xl">
          <div class="flex flex-col lg:flex-row items-center gap-8">

            <div class="text-center lg:text-left text-white flex-1">
              <h2 class="text-3xl lg:text-4xl font-bold mb-4">
                Pesan Lebih Mudah via WhatsApp!
              </h2>
              <p class="text-xl mb-6 text-white/90">
                Konsultasi gratis dan pesan langsung dengan admin kami.
                Respon cepat dan pelayanan ramah untuk Anda.
              </p>
              <a href="https://wa.me/6281332224169?text=Halo%20AVAIL%20Jombang,%20saya%20ingin%20bertanya%20tentang%20produk-produk%20Avail"
                target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-3 bg-white text-[#7BA87D] hover:bg-gray-100 px-8 py-5 rounded-2xl text-xl font-semibold transition-all hover:scale-105 shadow-lg">
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
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
    <section id="gallery-avail-tips-benefit" class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-4xl font-bold text-[#2C4A2F] mb-4">
            Pelajari Lebih Lanjut
          </h2>
          <p class="text-base md:text-xl text-gray-600">
            Ribuan pelanggan telah merasakan manfaatnya
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          <div v-for="(image, index) in galleryImages" :key="image.url"
            class="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
            @click="selectedImageIndex = index">
            <img :src="image.url" :alt="image.alt"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="absolute bottom-4 left-4 right-4">
                <p class="text-white text-sm md:text-lg font-semibold">{{ image.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Image Modal -->
    <ImageModal v-if="selectedImageIndex !== null" 
      :imageUrl="galleryImages[selectedImageIndex].url"
      :title="galleryImages[selectedImageIndex].title"
      :onNext="() => selectedImageIndex = (selectedImageIndex + 1) % galleryImages.length"
      :onPrevious="() => selectedImageIndex = (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length"
      :onClose="() => selectedImageIndex = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProducts } from '../composables/useProducts'
import { ArrowDown, ArrowRight, Award, Leaf, Shield, Zap } from 'lucide-vue-next'
import ImageModal from '../components/ImageModal.vue';

const { loadProducts, products } = useProducts()

const selectedImageIndex = ref(null);

const galleryImages = [
  {
    url: "/src/assets/images/Materi_1.jpeg",
    title: "Informasi",
    alt: "Informasi"
  },
  {
    url: "/src/assets/images/Materi_2.jpeg",
    title: "Informasi",
    alt: "Informasi"
  },
  {
    url: "/src/assets/images/Materi_3.jpeg",
    title: "Tips",
    alt: "Tips"
  },
  {
    url: "/src/assets/images/Materi_4.jpeg",
    title: "Tips",
    alt: "Tips"
  },
  {
    url: "/src/assets/images/Materi_5.jpeg",
    title: "Tips",
    alt: "Tips"
  },
  {
    url: "/src/assets/images/Materi_6.jpeg",
    title: "Tips",
    alt: "Tips"
  },
  {
    url: "/src/assets/images/Materi_7.jpeg",
    title: "Tips",
    alt: "Tips"
  },
  {
    url: "/src/assets/images/Materi_8.jpeg",
    title: "Tips",
    alt: "Tips"
  },
  {
    url: "/src/assets/images/Materi_9.jpeg",
    title: "Informasi",
    alt: "Informasi"
  },
];

onMounted(() => loadProducts())

// Featured products (first 3)
const featuredProducts = computed(() => products.value.slice(0, 3))

function scrollToGallery() {
  const section = document.getElementById('gallery-avail-tips-benefit')
  if (!section) return

  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>
