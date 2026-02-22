<template>
  <div class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-5xl font-bold text-[#2C4A2F] mb-4">
          Produk Kami
        </h1>
        <p class="text-xl text-gray-600">
          Pilih produk herbal yang sesuai dengan kebutuhan kesehatan Anda
        </p>
      </div>

      <!-- Filter -->
      <div class="bg-white rounded-xl shadow p-6 mb-8">

        <div class="flex items-center gap-4 mb-4">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2l-7 7v5l-4 2v-7L3 6V4z" />
          </svg>

          <h2 class="text-xl font-semibold text-gray-900">
            Kategori
          </h2>
        </div>

        <div class="flex flex-wrap gap-3">

          <button v-for="category in categories" :key="category.id" @click="selectedCategoryId = category.id" :class="[
            'px-6 py-3 rounded-lg text-lg font-medium transition-all cursor-pointer',

            selectedCategoryId === category.id
              ? 'bg-[#7BA87D] text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]">
            {{ category.name }}
          </button>

        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10">
        Loading products...
      </div>

      <!-- Products Grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>

      <!-- Empty -->
      <div v-if="!loading && products.length === 0" class="text-center py-10">
        <p class="text-xl text-gray-600">
          Tidak ada produk dalam kategori ini
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue'
import { useProducts } from '../composables/useProducts'

const { products, categories, loading, selectedCategoryId } = useProducts()
</script>