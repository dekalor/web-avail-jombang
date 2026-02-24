import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useCartStore } from '../stores/cart'

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
    const postalCode = ref("")
    
    const notes = ref("")

    // shipping
    const courierId = ref("")
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

    function clearShipping(cost, etd) {
      shippingCost.value = 0
      shippingEtd.value = ""
    }

    function resetAfterCheckout() {
      notes.value = ""
      courierId.value = ""
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
      postalCode,
      notes,

      courierId,

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