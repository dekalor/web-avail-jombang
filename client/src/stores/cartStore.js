import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi'

export const useCartStore = defineStore('cart', () => {
  const { get } = useApi()

  // State
  const items = ref([])

  function normalizeUnitFromProduct(product, preferredUnitCode = null) {
    const units = Array.isArray(product?.units) ? product.units : []
    if (!units.length) return null

    if (preferredUnitCode) {
      const matched = units.find(unit => unit.unitCode === preferredUnitCode)
      if (matched) return matched
    }

    if (product?.unitCode) {
      const matched = units.find(unit => unit.unitCode === product.unitCode)
      if (matched) return matched
    }

    return units[0]
  }

  function toCartKey(productId, unitCode) {
    return `${productId}:${unitCode || 'default'}`
  }

  function maxQtyByUnit(stock, qtyPerUnit) {
    const stockPcs = Number(stock || 0)
    const perUnit = Number(qtyPerUnit || 1)
    if (stockPcs <= 0 || perUnit <= 0) return 0
    return Math.floor(stockPcs / perUnit)
  }

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
  function addToCart(product, selectedUnitCode = null) {
    const selectedUnit = normalizeUnitFromProduct(product, selectedUnitCode)
    if (!selectedUnit) return false

    const maxQty = maxQtyByUnit(product.stock, selectedUnit.qtyPerUnit)
    if (maxQty <= 0) return false

    const cartKey = toCartKey(product.id, selectedUnit.unitCode)
    const existing = items.value.find(item => item.cartKey === cartKey)
    if (existing) {
      if (existing.quantity >= maxQty) return false
      existing.quantity++
    } else {
      items.value.push({
        ...product,
        quantity: 1,
        cartKey,
        productUnitId: selectedUnit.id,
        unitCode: selectedUnit.unitCode,
        unitLabel: selectedUnit.label || String(selectedUnit.unitCode || '').toUpperCase(),
        qtyPerUnit: Number(selectedUnit.qtyPerUnit || 1),
        price: Number(selectedUnit.price || product.price || 0),
        weight: Number(selectedUnit.weight || product.weight || 0),
      })
    }

    return true
  }

  function removeFromCart(cartKey) {
    items.value = items.value.filter(item => item.cartKey !== cartKey)
  }

  function updateQuantity(cartKey, quantity) {
    if (quantity <= 0) {
      removeFromCart(cartKey)
      return
    }
    const item = items.value.find(i => i.cartKey === cartKey)
    if (item) {
      const maxQty = maxQtyByUnit(item.stock, item.qtyPerUnit)
      item.quantity = maxQty > 0
        ? Math.min(quantity, maxQty)
        : quantity
    }
  }

  async function updateItemUnit(cartKey, nextUnitCode) {
    const item = items.value.find(i => i.cartKey === cartKey)
    if (!item) return false

    const res = await get('/products')
    if (!res.success || !Array.isArray(res.data)) return false

    const latest = res.data.find(product => product.id === item.id)
    if (!latest) return false

    const nextUnit = normalizeUnitFromProduct(latest, nextUnitCode)
    if (!nextUnit) return false

    const nextCartKey = toCartKey(item.id, nextUnit.unitCode)
    const maxQty = maxQtyByUnit(latest.stock, nextUnit.qtyPerUnit)
    if (maxQty <= 0) return false

    const existing = items.value.find(i => i.cartKey === nextCartKey && i.cartKey !== cartKey)
    const nextQuantity = Math.max(1, Math.min(item.quantity, maxQty))

    if (existing) {
      existing.quantity = Math.min(existing.quantity + nextQuantity, maxQty)
      removeFromCart(cartKey)
      return true
    }

    item.cartKey = nextCartKey
    item.productUnitId = nextUnit.id
    item.unitCode = nextUnit.unitCode
    item.unitLabel = nextUnit.label || String(nextUnit.unitCode || '').toUpperCase()
    item.qtyPerUnit = Number(nextUnit.qtyPerUnit || 1)
    item.price = Number(nextUnit.price || 0)
    item.weight = Number(nextUnit.weight || 0)
    item.stock = Number(latest.stock || 0)
    item.units = latest.units || []
    item.quantity = nextQuantity
    return true
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

      const nextUnit = normalizeUnitFromProduct(latest, item.unitCode)
      if (!nextUnit) return item

      const nextPrice = Number(nextUnit.price || 0)
      const nextStock = Number(latest.stock || 0)
      const nextWeight = Number(nextUnit.weight || 0)
      const nextQtyPerUnit = Number(nextUnit.qtyPerUnit || 1)
      const maxQty = maxQtyByUnit(nextStock, nextQtyPerUnit)
      const nextQuantity = maxQty > 0
        ? Math.min(item.quantity, maxQty)
        : item.quantity

      if (
        item.price !== nextPrice ||
        item.name !== latest.name ||
        item.weight !== nextWeight ||
        item.imageUrl !== latest.imageUrl ||
        item.stock !== nextStock ||
        item.qtyPerUnit !== nextQtyPerUnit ||
        item.unitCode !== nextUnit.unitCode ||
        item.active !== latest.active ||
        item.quantity !== nextQuantity
      ) updated = true

      return {
        ...item,
        cartKey: toCartKey(item.id, nextUnit.unitCode),
        name: latest.name,
        price: nextPrice,
        weight: nextWeight,
        imageUrl: latest.imageUrl,
        stock: nextStock,
        units: latest.units || [],
        productUnitId: nextUnit.id,
        unitCode: nextUnit.unitCode,
        unitLabel: nextUnit.label || String(nextUnit.unitCode || '').toUpperCase(),
        qtyPerUnit: nextQtyPerUnit,
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
    updateItemUnit,
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
