import { defineStore } from "pinia"
import { ref } from "vue"
import { useApi } from "../composables/useApi"
import { useCartStore } from "./cartStore"

const { get } = useApi()

export const useShippingStore = defineStore("shipping", () => {

  // data
  const provinces = ref([])
  const cities = ref([])
  const districts = ref([])
  const couriers = ref([])

  // loading states
  const loadingProvinces = ref(false)
  const loadingCities = ref(false)
  const loadingDistricts = ref(false)
  const loadingShippingCosts = ref(false)

  // shipping result
  const shippingCosts = ref({})

  // caches
  const citiesCache = new Map()
  const districtsCache = new Map()
  const shippingCache = new Map()

  const { totalWeight } = useCartStore()

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
  // FETCH DISTRICTS BY CITIES
  // ========================
  async function fetchDistricts(citiesId) {
    if (!citiesId) {
      districts.value = []
      return
    }

    // use cache
    if (districtsCache.has(citiesId)) {
      districts.value = districtsCache.get(citiesId)
      return
    }

    loadingDistricts.value = true

    try {
      const res = await get(
        `/shipping/districts?city_id=${citiesId}`
      )

      districts.value = res.data
      districtsCache.set(citiesId, res.data)
    } finally {
      loadingDistricts.value = false
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
  async function fetchShippingCosts(districtId) {

    if (!districtId) return

    if (shippingCache.has(districtId)) {
      shippingCosts.value = shippingCache.get(districtId)
      return
    }

    loadingShippingCosts.value = true

    // simulate loading
    // await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const res = await get(
        `/shipping/costs?destination_district_id=${districtId}&weight=${totalWeight}`
      )

      const costs = {}
      if (res.success) {
        for (const item of res.data) {
          costs[item.code] = {
            price: item.price,
            etd: item.etd
          }
        }
      }

      shippingCosts.value = costs
      shippingCache.set(districtId, costs)
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

  function clearDistricts() {
    districts.value = []
  }

  function clearShippingCosts() {
    shippingCosts.value = {}
  }

  return {

    // data
    provinces,
    cities,
    districts,
    couriers,

    // result
    shippingCosts,

    // loading
    loadingProvinces,
    loadingCities,
    loadingDistricts,
    loadingShippingCosts,

    // actions
    fetchProvinces,
    fetchCities,
    fetchDistricts,
    fetchCouriers,
    fetchShippingCosts,

    // helpers
    clearCities,
    clearDistricts,
    clearShippingCosts

  }

})