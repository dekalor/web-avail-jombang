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

  function usedStockPcs(productId, excludeCartKey = null) {
    return items.value
      .filter(item => item.id === productId && item.cartKey !== excludeCartKey)
      .reduce((sum, item) => {
        const qty = Number(item.quantity || 0)
        const perUnit = Number(item.qtyPerUnit || 1)
        return sum + qty * perUnit
      }, 0)
  }

  function maxQtyByUnit(stock, qtyPerUnit, usedPcs = 0) {
    const stockPcs = Number(stock || 0)
    const perUnit = Number(qtyPerUnit || 1)
    const availablePcs = stockPcs - Number(usedPcs || 0)
    if (availablePcs <= 0 || perUnit <= 0) return 0
    return Math.floor(availablePcs / perUnit)
  }

  function usedStockPcsForProduct(productId) {
    return items.value
      .filter(item => item.id === productId)
      .reduce((sum, item) => {
        const qty = Number(item.quantity || 0)
        const perUnit = Number(item.qtyPerUnit || 1)
        return sum + qty * perUnit
      }, 0)
  }

  function availableQtyForUnit({ product, unitCode, qtyPerUnit, excludeCartKey = null }) {
    if (!product) return 0
    const perUnit = Number(qtyPerUnit || 1)
    if (perUnit <= 0) return 0

    const selectedKey = excludeCartKey
      || toCartKey(product.id, unitCode || product.unitCode || 'default')

    const usedOtherPcs = usedStockPcs(product.id, selectedKey)
    return maxQtyByUnit(product.stock, perUnit, usedOtherPcs)
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

    const cartKey = toCartKey(product.id, selectedUnit.unitCode)
    const usedPcsOther = usedStockPcs(product.id, cartKey)
    const maxQty = maxQtyByUnit(product.stock, selectedUnit.qtyPerUnit, usedPcsOther)
    if (maxQty <= 0) return false

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
      const usedPcsOther = usedStockPcs(item.id, cartKey)
      const maxQty = maxQtyByUnit(item.stock, item.qtyPerUnit, usedPcsOther)
      if (maxQty <= 0) {
        removeFromCart(cartKey)
        return
      }
      item.quantity = Math.min(quantity, maxQty)
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
    let usedPcsOther = usedStockPcs(item.id, cartKey)
    const existing = items.value.find(i => i.cartKey === nextCartKey && i.cartKey !== cartKey)
    if (existing) {
      usedPcsOther -= Number(existing.quantity || 0) * Number(existing.qtyPerUnit || 1)
    }

    const maxQty = maxQtyByUnit(latest.stock, nextUnit.qtyPerUnit, usedPcsOther)
    if (maxQty <= 0) return false

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
    const totalPcsByProduct = new Map()

    items.value.forEach((item) => {
      const current = totalPcsByProduct.get(item.id) || 0
      const qty = Number(item.quantity || 0)
      const perUnit = Number(item.qtyPerUnit || 1)
      totalPcsByProduct.set(item.id, current + qty * perUnit)
    })

    let updated = false

    const nextItems = items.value.map(item => {
      const latest = productsById.get(item.id)
      if (!latest) return item

      const nextUnit = normalizeUnitFromProduct(latest, item.unitCode)
      if (!nextUnit) return item

      const nextPrice = Number(nextUnit.price || 0)
      const nextStock = Number(latest.stock || 0)
      const nextWeight = Number(nextUnit.weight || 0)
      const nextQtyPerUnit = Number(nextUnit.qtyPerUnit || 1)
      const totalPcs = totalPcsByProduct.get(item.id) || 0
      const usedOtherPcs = totalPcs - (Number(item.quantity || 0) * Number(item.qtyPerUnit || 1))
      const maxQty = maxQtyByUnit(nextStock, nextQtyPerUnit, usedOtherPcs)
      const nextQuantity = maxQty > 0
        ? Math.min(item.quantity, maxQty)
        : 0

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

    items.value = nextItems.filter(item => item.quantity > 0)
    if (items.value.length !== nextItems.length) updated = true

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
    refreshCartPrices,
    availableQtyForUnit,
    usedStockPcsForProduct
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
