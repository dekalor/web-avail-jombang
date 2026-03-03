import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useCartStore } from './cartStore'
import { useErrorModal } from "../composables/useErrorModal"
import { useApi } from "../composables/useApi"

export const useCheckoutStore = defineStore(
  "checkout",
  () => {
    const cartStore = useCartStore()
    const { showError } = useErrorModal()
    const { post, get } = useApi()

    // customer info
    const name = ref("")
    const phone = ref("")

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
    const paymentMethods = ref([])
    const bankAccounts = ref([])
    const paymentMethodType = ref("")
    const paymentMethod = ref(null)
    const paymentProof = ref(null)
    const paymentProofPreview = ref(null)
    const fileInput = ref(null)

    const loading = ref(false)
    const error = ref("")
    const success = ref(false)
    const freeShippingMin = ref(0)
    const guestCheckoutToken = ref("")
    const challengeId = ref("")
    const challengeLoadedAt = ref(0)

    // order
    // subtotal comes from cartStore (computed reference)
    const subtotal = computed(() =>
      cartStore.totalPrice
    )

    const isFreeShippingEligible = computed(() =>
      freeShippingMin.value > 0 && subtotal.value >= freeShippingMin.value
    )

    const remainingForFreeShipping = computed(() => {
      if (!freeShippingMin.value) return 0
      return Math.max(freeShippingMin.value - subtotal.value, 0)
    })

    const appliedShippingCost = computed(() => {
      if (paymentMethodType.value === "cod") return 0
      if (isFreeShippingEligible.value) return 0
      return shippingCost.value
    })

    const grandTotal = computed(() =>
      subtotal.value + appliedShippingCost.value
    )

    function setShipping(cost, etd) {
      shippingCost.value = cost
      shippingEtd.value = etd
    }

    function clearShipping() {
      shippingCost.value = 0
      shippingEtd.value = ""
    }

    async function fetchPaymentMethods() {
      await cartStore.refreshCartPrices()

      const res = await get("/orders/get-payment-method")

      if (res.success) {
        const result = Array.from(
          new Map(res.data.map(item => [item.type, item])).values()
        );

        paymentMethods.value = result
        bankAccounts.value = res.data.filter(item => item.type === 'bank')
      }
    }

    async function fetchCheckoutConfig() {
      const res = await get("/orders/checkout-config")
      if (res.success) {
        freeShippingMin.value = Number(res.data?.free_shipping_min || 0)
      }
    }

    async function fetchCheckoutProtection() {
      const res = await get("/orders/checkout-protection")

      if (res.success) {
        guestCheckoutToken.value = res.data.guest_checkout_token || ""
        challengeId.value = res.data.challenge_id || ""
        challengeLoadedAt.value = Date.now()
      }
    }

    async function submitOrder() {

      loading.value = true
      error.value = ""
      success.value = false

      try {
        if (!guestCheckoutToken.value || !challengeId.value) {
          await fetchCheckoutProtection()
        }

        let paymentProofData = null
        if (paymentProof.value) {
          paymentProofData = await fileToDataUrl(paymentProof.value)
        }

        const payload = {
          customer: {
            name: name.value,
            phone: phone.value,
          },
          shipping: {
            province_id: provinceId.value,
            city_id: cityId.value,
            district_id: districtId.value,
            address: address.value,
            postal_code: postalCode.value,
            notes: notes.value,
            courier_code: courierCode.value,
            cost: appliedShippingCost.value,
          },
          payment_method: paymentMethodType.value,
          ...(paymentMethod.value ? { payment_method_id: paymentMethod.value } : {}),
          ...(paymentProofData ? { payment_proof_data: paymentProofData } : {}),
          guest_checkout_token: guestCheckoutToken.value,
          challenge_id: challengeId.value,
          items: cartStore.items.map(item => ({
            product_id: item.id,
            qty: item.quantity,
            price: item.price
          })),
          subtotal: subtotal.value,
        }

        const res = await post("/orders/create", payload)
        if (res.success) {
          success.value = true

          // clear cart & checkout
          cartStore.clearCart()
          resetAfterCheckout()

          return res.data
        }

        // refresh challenge when submit failed from server response
        await fetchCheckoutProtection()

      } catch (err) {
        error.value =
          err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat checkout, silahkan coba beberapa saat lagi"

        showError(error.value, 'Checkout gagal')

      } finally {
        loading.value = false
      }

    }

    function resetAfterCheckout() {
      notes.value = ""
      courierCode.value = ""
      shippingCost.value = 0
      shippingEtd.value = ""
      paymentMethodType.value = ""
      paymentMethod.value = null
      handleRemovePaymentProof()
    }

    function handlePaymentProofChange(e) {
      const file = e.target.files?.[0]
      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Mohon upload file gambar (JPG, PNG, dll)')
          return
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Ukuran file maksimal 5MB')
          return
        }
        paymentProof.value = file
        paymentProofPreview.value = URL.createObjectURL(file)
      }
    }

    function handleRemovePaymentProof() {
      paymentProof.value = null
      paymentProofPreview.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    function fileToDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Gagal membaca file bukti pembayaran'))
        reader.readAsDataURL(file)
      })
    }

    return {
      name,
      phone,

      provinceId,
      cityId,
      districtId,
      postalCode,
      address,
      notes,

      courierCode,
      shippingCost,
      shippingEtd,

      paymentMethods,
      bankAccounts,
      paymentMethodType,
      paymentMethod,
      paymentProof,
      paymentProofPreview,
      fileInput,

      loading,
      error,
      success,
      freeShippingMin,
      guestCheckoutToken,
      challengeId,
      challengeLoadedAt,

      subtotal,
      isFreeShippingEligible,
      remainingForFreeShipping,
      appliedShippingCost,
      grandTotal,

      setShipping,
      clearShipping,
      fetchCheckoutConfig,
      fetchPaymentMethods,
      fetchCheckoutProtection,
      submitOrder,
      resetAfterCheckout,
      handlePaymentProofChange,
      handleRemovePaymentProof
    }

  },
  {
    persist: {
      key: "checkout-store",
      storage: localStorage
    }
  }
)
