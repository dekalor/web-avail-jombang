import { ref, onMounted, computed, watch } from "vue"
import { useApi } from '../composables/useApi.js'

const products = ref([])
const categories = ref([])
const loading = ref(false)
const selectedCategoryId = ref(0)
const product = ref(null)

export function useProducts() {
  const { get } = useApi()

  function formatPrice(price) {
    return `Rp ${price.toLocaleString('id-ID')}`
  }

  function calculateDiscount(price, originalPrice) {
    if (!originalPrice) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const categoryOptions = computed(() => [
    { id: 0, name: "Semua" },
    ...categories.value
  ])

  async function loadProducts() {
    loading.value = true
    try {
      let url = '/products'

      if (selectedCategoryId.value !== 0) {
        const params = new URLSearchParams()
        params.set('category_id', selectedCategoryId.value)

        url += `?${params.toString()}`
      }

      const res = await get(url)

      if (!res.success) {
        throw new Error('Failed to fetch products')
      }

      products.value = res.data

    } catch (err) {
      console.error(err)
      products.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadCategories() {
    const res = await get('/products/categories')
    categories.value = res.data
  }

  async function getProductById(id) {
    loading.value = true
    try {
      const res = await get(`/products/${id}`)
      if (!res.success) {
        throw new Error('Product not found')
      }

      product.value = await res.data
      return product.value

    } catch (err) {
      console.error(err)
      product.value = null
      return null

    } finally {
      loading.value = false
    }
  }

  function formatWeight(grams) {
    const kg = grams / 1000
    return `${parseFloat(kg.toFixed(2))}kg`
  }

  function formatUnitLabel(unit) {
    const label = unit?.label || String(unit?.unitCode || '').toUpperCase()
    const qtyPerUnit = Number(unit?.qtyPerUnit || 1)
    const unitCode = String(unit?.unitCode || '').toLowerCase()

    if (!label) return 'UNIT'
    if (qtyPerUnit <= 1 || unitCode === 'pcs') return label
    return `${label} (${qtyPerUnit} pcs)`
  }

  return {
    products,
    product,
    categories: categoryOptions,
    loading,
    selectedCategoryId,
    loadProducts,
    loadCategories,
    getProductById,

    formatPrice,
    calculateDiscount,
    formatWeight,
    formatUnitLabel,
  }
}
