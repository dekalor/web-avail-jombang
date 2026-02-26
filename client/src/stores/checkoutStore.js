import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useCartStore } from './cartStore'

export const useCheckoutStore = defineStore(
  "checkout",
  () => {
    const cartStore = useCartStore()

    // customer info
    const name = ref("")
    const phone = ref("")
    const email = ref("")

    // address
    const address = ref("")
    const provinceId = ref("")
    const cityId = ref("")
    const districtId = ref("")
    const postalCode = ref("")
    
    const notes = ref("")

    // shipping
    const courierCode = ref("")
    const shippingCost = ref(0)
    const shippingEtd = ref("")

    // payment
    const paymentMethod = ref("cod")

    // order
    // subtotal comes from cartStore (computed reference)
    const subtotal = computed(() =>
      cartStore.totalPrice
    )

    const grandTotal = computed(() =>
      subtotal.value + shippingCost.value
    )

    function setShipping(cost, etd) {
      shippingCost.value = cost
      shippingEtd.value = etd
    }

    function clearShipping() {
      shippingCost.value = 0
      shippingEtd.value = ""
    }

    function resetAfterCheckout() {
      notes.value = ""
      courierCode.value = ""
      shippingCost.value = 0
      shippingEtd.value = ""
      paymentMethod.value = "cod"
      subtotal.value = 0
    }

    return {
      name,
      phone,
      email,

      address,

      provinceId,
      cityId,
      districtId,
      postalCode,
      notes,

      courierCode,
      shippingCost,
      shippingEtd,

      paymentMethod,

      subtotal,
      grandTotal,

      setShipping,
      clearShipping,
      resetAfterCheckout
    }

  },
  {
    persist: {
      key: "checkout-store",
      storage: localStorage
    }
  }
)