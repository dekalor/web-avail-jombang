<template>
  <div class="min-h-screen py-6 sm:py-8 lg:py-12">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-8 sm:mb-10 lg:mb-12">

        <h1 class="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#2C4A2F] mb-2 sm:mb-3 lg:mb-4">
          Produk Kami
        </h1>

        <p class="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl">
          Pilih produk herbal yang sesuai dengan kebutuhan kesehatan Anda
        </p>

      </div>

      <!-- Filter -->
      <div class="bg-white rounded-xl shadow p-4 sm:p-5 lg:p-6 mb-6 sm:mb-8">

        <!-- Filter Header -->
        <div class="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">

          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2l-7 7v5l-4 2v-7L3 6V4z" />
          </svg>

          <h2 class="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
            Kategori
          </h2>

        </div>

        <!-- Category Buttons -->
        <div class="flex flex-wrap gap-2 sm:gap-3">

          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategoryId = category.id"
            :class="[
              'px-3 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3',
              'text-sm sm:text-base lg:text-lg',
              'rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap',

              selectedCategoryId === category.id
                ? 'bg-[#7BA87D] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ category.name }}
          </button>

        </div>

      </div>

      <!-- Loading -->
      <div
        v-if="loading"
        class="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-4 sm:gap-6
        "
      >
        <div
          v-for="n in 8"
          :key="`skeleton-${n}`"
          class="overflow-hidden bg-white rounded-xl shadow-sm animate-pulse"
        >
          <div class="aspect-square bg-gray-200"></div>
          <div class="p-5">
            <div class="h-5 w-24 bg-gray-200 rounded-full mb-4"></div>
            <div class="h-6 w-3/4 bg-gray-200 rounded mb-3"></div>
            <div class="h-4 w-full bg-gray-200 rounded mb-2"></div>
            <div class="h-4 w-2/3 bg-gray-200 rounded mb-6"></div>
            <div class="h-8 w-1/2 bg-gray-200 rounded mb-4"></div>
            <div class="space-y-2 mb-4">
              <div class="h-3 w-20 bg-gray-200 rounded"></div>
              <div class="flex gap-2">
                <div class="h-8 w-14 bg-gray-200 rounded-full"></div>
                <div class="h-8 w-14 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div class="h-11 w-full bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div
        v-else
        class="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-4 sm:gap-6
        "
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty -->
      <div
        v-if="!loading && products.length === 0"
        class="text-center py-10 sm:py-14"
      >
        <p class="text-sm sm:text-base lg:text-xl text-gray-600">
          Tidak ada produk dalam kategori ini
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import { useProducts } from '../composables/useProducts'

const { init, products, loadProducts, loadCategories, categories, loading, selectedCategoryId } = useProducts()

onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadCategories()
  ])
})

watch(selectedCategoryId, () => {
  loadProducts()
})
</script>