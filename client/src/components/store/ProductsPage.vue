<template>
  <div class="page-section">
    <div class="section-header">
      <p class="section-eyebrow">All products</p>
      <!-- <h2 class="section-title">Find your perfect fit</h2> -->
    </div>
    <div class="toolbar">
      <div class="toolbar-group">
        <label for="category-filter">Category</label>
        <select id="category-filter" v-model="selectedCategoryId">
          <option value="all">All</option>
          <option
            v-for="category in categoryOptions"
            :key="category.id"
            :value="String(category.id)"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="toolbar-group">
        <label for="price-sort">Sort by price</label>
        <select id="price-sort" v-model="selectedPriceSort">
          <option value="default">Default</option>
          <option value="asc">Lowest to highest</option>
          <option value="desc">Highest to lowest</option>
        </select>
      </div>
    </div>
    <div class="products-grid">
      <ProductCard
        v-for="p in displayedProducts"
        :key="p.id"
        :product="p"
        @add-to-cart="$emit('add-to-cart', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ProductCard from './ProductCard.vue'
const props = defineProps({ products: { type: Array, default: () => [] } })
defineEmits(['add-to-cart'])

const selectedCategoryId = ref('all')
const selectedPriceSort = ref('default')
const displayedProducts = ref(props.products.slice())

// Matches seeded names in server/db/schema.sql (product_categories).
const fallbackCategoryNames = {
  1: 'FC Sanitary Pad',
  2: 'Health Food',
}

function getCategoryId(product) {
  return product.category_id ?? product.categoryId ?? product.category?.id ?? null
}

function getCategoryName(product, categoryId) {
  return (
    product.category_name ??
    product.categoryName ??
    product.category?.name ??
    fallbackCategoryNames[categoryId] ??
    `Category ${categoryId}`
  )
}

const categoryOptions = computed(() => {
  const byId = new Map()

  for (const product of props.products) {
    const categoryId = getCategoryId(product)
    if (categoryId == null) continue
    if (!byId.has(categoryId)) {
      byId.set(categoryId, { id: categoryId, name: getCategoryName(product, categoryId) })
    }
  }

  return Array.from(byId.values()).sort((a, b) => String(a.name).localeCompare(String(b.name)))
})

async function loadProductsFromApi() {
  try {
    const params = new URLSearchParams()
    params.set('category_id', selectedCategoryId.value)
    params.set('sort_price', selectedPriceSort.value)
    const res = await fetch(`/api/products?${params.toString()}`)
    const json = await res.json()
    if (json.success) displayedProducts.value = json.data
  } catch (err) {
    console.error('Failed to load filtered products', err)
  }
}

watch([selectedCategoryId, selectedPriceSort], loadProductsFromApi, { immediate: true })
</script>

<style scoped>
.page-section { max-width: 1200px; margin: 0 auto; padding: 60px 40px; }
.section-header { margin-bottom: 48px; }
.section-eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--sage); font-weight: 500; margin-bottom: 8px; }
.section-title { font-family: var(--font-display); font-size: 40px; font-weight: 300; }
.toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.toolbar-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 220px;
}
.toolbar-group label {
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--mid);
}
.toolbar-group select {
  height: 42px;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0 12px;
  background: var(--warm-white);
  font-size: 14px;
  color: var(--charcoal);
}
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px; }
@media (max-width: 768px) { .page-section { padding: 40px 20px; } }
</style>
