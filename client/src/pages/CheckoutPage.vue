<template>
  <div class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl sm:text-4xl lg:text-5xl font-bold text-[#2C4A2F] mb-12">
        Checkout
      </h1>

      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6 min-w-0">
            <CustomerInfoSection :checkoutStore="checkoutStore" />

            <ShippingAddressSection
              :checkoutStore="checkoutStore"
              :shippingStore="shippingStore"
              :filterNumber="filterNumber"
            />

            <PaymentSection
              :checkoutStore="checkoutStore"
              :shippingStore="shippingStore"
              :copiedBank="copiedBank"
              :isCodAvailable="isCodAvailable"
              :canSelectCod="canSelectCod"
              :selectPaymentMethod="selectPaymentMethod"
              :setPaymentMethod="setPaymentMethod"
              :handleCopyAccountNumber="handleCopyAccountNumber"
              :formatPrice="formatPrice"
            />
          </div>

          <OrderSummarySection
            :cart="cart"
            :cartStore="cartStore"
            :shippingStore="shippingStore"
            :checkoutStore="checkoutStore"
            :formatPrice="formatPrice"
            :formatWeight="formatWeight"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cartStore'
import { useShippingStore } from '../stores/shippingStore'
import { useCheckoutStore } from '../stores/checkoutStore'
import { useProducts } from '../composables/useProducts'
import CustomerInfoSection from '../components/checkout/CustomerInfoSection.vue'
import ShippingAddressSection from '../components/checkout/ShippingAddressSection.vue'
import PaymentSection from '../components/checkout/PaymentSection.vue'
import OrderSummarySection from '../components/checkout/OrderSummarySection.vue'

const router = useRouter()
const cartStore = useCartStore()
const shippingStore = useShippingStore()
const checkoutStore = useCheckoutStore()
const { formatPrice, formatWeight } = useProducts()

// Reactive state
const copiedBank = ref(null)
const { items: cart } = storeToRefs(cartStore)
const isCodAvailable = computed(() =>
  Number(checkoutStore.cityId) === 389
)

const filterNumber = () => {
  checkoutStore.postalCode = checkoutStore.postalCode.replace(/\D/g, '')
}

// Redirect to cart if empty and not in success state
watch(() => cart.value.length, (newLength) => {
  redirectToCart(newLength)
})

// when province change
watch(() => checkoutStore.provinceId, async (provinceId) => {
  checkoutStore.cityId = ""
  checkoutStore.districtId = ""
  shippingStore.clearCities()
  shippingStore.clearDistricts()

  shippingStore.clearShippingCosts()
  checkoutStore.clearShipping()

  if (provinceId)
    await shippingStore.fetchCities(provinceId)
})

// when city change
watch(() => checkoutStore.cityId, async (cityId) => {
    checkoutStore.districtId = ""
    shippingStore.clearShippingCosts()
    checkoutStore.clearShipping()

    if (Number(cityId) !== 389 && checkoutStore.paymentMethodType === 'cod') {
      checkoutStore.paymentMethodType = ""
      checkoutStore.paymentMethod = null
    }

    if (cityId)
      await shippingStore.fetchDistricts(cityId)
  }
)

// when district change
watch(() => checkoutStore.districtId, async (districtId) => {
    shippingStore.clearShippingCosts()
    checkoutStore.clearShipping()

    if (districtId) {
      await shippingStore.fetchShippingCosts(districtId)
      setShipping(checkoutStore.courierCode)
    }
  }
)

// when courier change
watch(() => checkoutStore.courierCode, (courierCode) => setShipping(courierCode))

// when payment method change
watch(() => checkoutStore.paymentMethodType, (method) => {
  if (method === "cod") {
    checkoutStore.courierCode = ""
    checkoutStore.clearShipping()
  }
})

onMounted(async () => {
  redirectToCart(cart.value.length)

  if (!isCodAvailable.value && checkoutStore.paymentMethodType === 'cod') {
    checkoutStore.paymentMethodType = ""
    checkoutStore.paymentMethod = null
  }

  // fetch payment method
  checkoutStore.fetchCheckoutConfig()
  checkoutStore.fetchPaymentMethods()
  checkoutStore.fetchCheckoutProtection()

  if (!shippingStore.provinces.length)
    shippingStore.fetchProvinces()

  if (!shippingStore.couriers.length)
    shippingStore.fetchCouriers()

  // restore selected cities
  if (
    checkoutStore.provinceId &&
    !shippingStore.cities.length
  ) {
    await shippingStore.fetchCities(
      checkoutStore.provinceId
    )
  }

  // restore selected district
  if (
    checkoutStore.cityId &&
    !shippingStore.districts.length
  ) {
    await shippingStore.fetchDistricts(
      checkoutStore.cityId
    )
  }

  // restore selected shipping costs
  if (
    checkoutStore.districtId &&
    Object.keys(shippingStore.shippingCosts).length === 0
  ) {
    await shippingStore.fetchShippingCosts(
      checkoutStore.districtId
    )
  }
})

// Methods
async function handleSubmit() {
  const order = await checkoutStore.submitOrder()

  if (checkoutStore.success) {
    router.push({
      path: "/order-success/",
      query: {
        order_number: order?.orderNumber || '',
        total: order?.total || 0,
      }
    })
  }
}

function setPaymentMethodType(paymentMethodType) {
  if (paymentMethodType === 'cod' && !isCodAvailable.value) return
  checkoutStore.paymentMethodType = paymentMethodType
}

function setPaymentMethod(paymentMethodId) {
  checkoutStore.paymentMethod = paymentMethodId
}

function selectPaymentMethod(paymentMethod) {
  if (!canSelectCod(paymentMethod.type)) return

  setPaymentMethodType(paymentMethod.type)
  setPaymentMethod(paymentMethod.id)
}

function canSelectCod(type) {
  if (type !== 'cod') return true
  return isCodAvailable.value
}

function handleCopyAccountNumber(bankId) {
  const bank = checkoutStore.bankAccounts.find(b => b.id === bankId)
  navigator.clipboard.writeText(bank.accountNumber)
  copiedBank.value = bankId

  setTimeout(() => {
    copiedBank.value = null
  }, 2000)
}

function setShipping(courierCode) {
  const cost = shippingStore.shippingCosts[courierCode]
  if (cost) {
    checkoutStore.setShipping(
      cost.price,
      cost.etd
    )
  }
}

function redirectToCart(cartLength) {
  if (cartLength === 0 && !checkoutStore.success) {
    router.push('/cart')
  }
}
</script>
