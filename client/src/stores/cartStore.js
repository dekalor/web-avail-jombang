import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi'

export const useCartStore = defineStore('cart', () => {
  const { get } = useApi()

  // State
  const items = ref([])

  // Getters (computed)
  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const totalWeight = computed(() => {
    return items.value.reduce(
      (total, item) =>
        total + item.weight * item.quantity,
      0
    )
  })

  // Actions
  function addToCart(product) {
    const maxStock = Number(product.stock || 0)
    if (maxStock <= 0) return false

    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      if (existing.quantity >= maxStock) return false
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }

    return true
  }

  function removeFromCart(productId) {
    items.value = items.value.filter(item => item.id !== productId)
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    const item = items.value.find(i => i.id === productId)
    if (item) {
      const maxStock = Number(item.stock || 0)
      item.quantity = maxStock > 0
        ? Math.min(quantity, maxStock)
        : quantity
    }
  }

  function clearCart() {
    items.value = []
  }

  async function refreshCartPrices() {
    if (!items.value.length) return { success: true, updated: false }

    const res = await get('/products')
    if (!res.success || !Array.isArray(res.data)) {
      return { success: false, updated: false }
    }

    const productsById = new Map(res.data.map(product => [product.id, product]))
    let updated = false

    items.value = items.value.map(item => {
      const latest = productsById.get(item.id)
      if (!latest) return item

      const nextPrice = Number(latest.price)
      const nextStock = Number(latest.stock || 0)
      const nextQuantity = nextStock > 0
        ? Math.min(item.quantity, nextStock)
        : item.quantity

      if (
        item.price !== nextPrice ||
        item.name !== latest.name ||
        item.weight !== latest.weight ||
        item.imageUrl !== latest.imageUrl ||
        item.stock !== nextStock ||
        item.active !== latest.active ||
        item.quantity !== nextQuantity
      ) updated = true

      return {
        ...item,
        name: latest.name,
        price: nextPrice,
        weight: latest.weight,
        imageUrl: latest.imageUrl,
        stock: nextStock,
        active: latest.active,
        quantity: nextQuantity,
      }
    })

    return { success: true, updated }
  }

  return {
    items,
    totalItems,
    totalPrice,
    totalWeight,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCartPrices
  }
}, {
  persist: {
    key: 'cart-store',
    storage: localStorage
  },

  // only persist important data
  paths: [
    "items",
  ]
})
