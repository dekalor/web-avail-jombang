import { defineStore } from "pinia"
import { ref } from "vue"
import { useApi } from "../composables/useApi"

const { get } = useApi()

export const useShippingStore = defineStore("shipping", () => {

  // data
  const provinces = ref([])
  const cities = ref([])
  const couriers = ref([])

  // loading states
  const loadingProvinces = ref(false)
  const loadingCities = ref(false)
  const loadingShippingCosts = ref(false)

  // shipping result
  const shippingCosts = ref({})

  // caches
  const citiesCache = new Map()
  const shippingCache = new Map()

  // ========================
  // FETCH PROVINCES
  // ========================
  async function fetchProvinces() {
    if (provinces.value.length) return

    loadingProvinces.value = true

    try {
      const res = await get("/shipping/provinces")
      provinces.value = res.data
    } finally {
      loadingProvinces.value = false
    }
  }

  // ========================
  // FETCH CITIES BY PROVINCE
  // ========================
  async function fetchCities(provinceId) {
    if (!provinceId) {
      cities.value = []
      return
    }

    // use cache
    if (citiesCache.has(provinceId)) {
      cities.value = citiesCache.get(provinceId)
      return
    }

    loadingCities.value = true

    try {
      const res = await get(
        `/shipping/cities?province_id=${provinceId}`
      )

      cities.value = res.data
      citiesCache.set(provinceId, res.data)
    } finally {
      loadingCities.value = false
    }
  }

  // ========================
  // FETCH COURIERS
  // ========================
  async function fetchCouriers() {
    if (couriers.value.length) return

    const res = await get("/shipping/couriers")
    couriers.value = res.data
  }

  // ========================
  // FETCH ALL COURIER COSTS AT ONCE
  // ========================
  async function fetchShippingCosts(cityId) {

    if (!cityId) return

    if (shippingCache.has(cityId)) {
      shippingCosts.value = shippingCache.get(cityId)
      return
    }

    loadingShippingCosts.value = true

    try {
      // const res = await get(
      //   `/shipping-costs?city_id=${cityId}`
      // )
      const res = {
        data: [
          { id: 1, price: 18000, etd: "2-3 hari" },
          { id: 2, price: 15000, etd: "3-4 hari" }
        ]
      }

      const costs = {}
      for (const item of res.data) {
        costs[item.id] = {
          price: item.price,
          etd: item.etd
        }
      }

      shippingCosts.value = costs
      shippingCache.set(cityId, costs)
    } finally {
      loadingShippingCosts.value = false
    }

  }

  // ========================
  // RESET
  // ========================
  function clearCities() {
    cities.value = []
  }

  function clearShippingCosts() {
    shippingCosts.value = {}
  }

  return {

    // data
    provinces,
    cities,
    couriers,

    // result
    shippingCosts,

    // loading
    loadingProvinces,
    loadingCities,
    loadingShippingCosts,

    // actions
    fetchProvinces,
    fetchCities,
    fetchCouriers,
    fetchShippingCosts,

    // helpers
    clearCities,
    clearShippingCosts

  }

})