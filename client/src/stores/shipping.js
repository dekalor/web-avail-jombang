import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const useShippingStore = defineStore("shipping", () => {

  const provinces = ref([])
  const cities = ref([])
  const couriers = ref([])

  const selectedProvince = ref(null)
  const selectedCity = ref(null)
  const selectedCourier = ref(null)

  const shippingCost = ref(0)
  const etd = ref("")

  // cache
  const cache = new Map()

  async function fetchProvinces() {

    const res = await fetch("/api/provinces")
    provinces.value = await res.json()

  }

  async function fetchCities() {

    if (!selectedProvince.value) return

    const res = await fetch(
      `/api/cities?province_id=${selectedProvince.value}`
    )

    cities.value = await res.json()

  }

  async function fetchCouriers() {

    const res = await fetch("/api/couriers")
    couriers.value = await res.json()

  }

  async function calculateShipping() {

    if (!selectedCity.value || !selectedCourier.value)
      return

    const key =
      `${selectedCity.value}-${selectedCourier.value}`

    // use cache
    if (cache.has(key)) {

      const data = cache.get(key)

      shippingCost.value = data.price
      etd.value = data.etd

      return

    }

    const res = await fetch(
      `/api/shipping-cost?city_id=${selectedCity.value}&courier_id=${selectedCourier.value}`
    )

    const data = await res.json()

    shippingCost.value = data.price
    etd.value = data.etd

    cache.set(key, data)

  }

  return {

    provinces,
    cities,
    couriers,

    selectedProvince,
    selectedCity,
    selectedCourier,

    shippingCost,
    etd,

    fetchProvinces,
    fetchCities,
    fetchCouriers,
    calculateShipping

  }

})