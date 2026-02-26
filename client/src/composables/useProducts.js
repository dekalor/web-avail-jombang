// src/composables/useProducts.js
// Products data - in production, fetch from /api/products

// export const products = [
//   {
//     id: '1',
//     name: 'Asam Urat & Rematik',
//     price: 95000,
//     originalPrice: 120000,
//     image: 'https://images.unsplash.com/photo-1766416430069-fc90148eeb9b?w=400',
//     description: 'Membantu mengurangi asam urat dan rematik secara alami',
//     benefits: ['Mengurangi nyeri sendi', 'Menurunkan kadar asam urat', 'Herbal alami'],
//     category: 'Tulang & Sendi'
//   },
//   {
//     id: '2',
//     name: 'Darah Tinggi & Jantung',
//     price: 85000,
//     originalPrice: 110000,
//     image: 'https://images.unsplash.com/photo-1758525732480-8df43412b54c?w=400',
//     description: 'Menjaga kesehatan jantung dan mengontrol tekanan darah',
//     benefits: ['Menurunkan tekanan darah', 'Menjaga kesehatan jantung', 'Meningkatkan sirkulasi'],
//     category: 'Jantung & Pembuluh Darah'
//   },
//   {
//     id: '3',
//     name: 'Kolesterol & Diabetes',
//     price: 90000,
//     originalPrice: 115000,
//     image: 'https://images.unsplash.com/photo-1565206590057-55bb1c51d7d7?w=400',
//     description: 'Membantu mengontrol gula darah dan kolesterol',
//     benefits: ['Menurunkan kolesterol', 'Mengontrol gula darah', 'Meningkatkan metabolisme'],
//     category: 'Metabolisme'
//   },
//   {
//     id: '4',
//     name: 'Stamina & Vitalitas',
//     price: 80000,
//     originalPrice: 100000,
//     image: 'https://images.unsplash.com/photo-1766416430069-fc90148eeb9b?w=400',
//     description: 'Meningkatkan stamina dan vitalitas sehari-hari',
//     benefits: ['Meningkatkan energi', 'Mengurangi kelelahan', 'Menjaga daya tahan tubuh'],
//     category: 'Kesehatan Umum'
//   },
//   {
//     id: '5',
//     name: 'Pencernaan Sehat',
//     price: 75000,
//     originalPrice: 95000,
//     image: 'https://images.unsplash.com/photo-1758525732480-8df43412b54c?w=400',
//     description: 'Menjaga kesehatan sistem pencernaan',
//     benefits: ['Melancarkan pencernaan', 'Mengatasi maag', 'Meningkatkan penyerapan nutrisi'],
//     category: 'Pencernaan'
//   },
//   {
//     id: '6',
//     name: 'Tulang & Sendi Kuat',
//     price: 95000,
//     originalPrice: 120000,
//     image: 'https://images.unsplash.com/photo-1565206590057-55bb1c51d7d7?w=400',
//     description: 'Memperkuat tulang dan sendi untuk aktivitas optimal',
//     benefits: ['Memperkuat tulang', 'Meningkatkan fleksibilitas sendi', 'Mencegah osteoporosis'],
//     category: 'Tulang & Sendi'
//   },
// ]
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

  return {
    products,
    product,
    categories: categoryOptions,
    selectedCategoryId,
    loadProducts,
    loadCategories,
    getProductById,

    formatPrice,
    calculateDiscount,
    formatWeight,
  }
}
