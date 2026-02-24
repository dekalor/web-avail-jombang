<template>
  <!-- Success State -->
  <div v-if="isSuccess" class="min-h-screen flex items-center justify-center py-12">
    <Card class="max-w-2xl w-full p-12 text-center">
      <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle class="w-16 h-16 text-green-600" />
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Pesanan Berhasil!
      </h1>
      <p class="text-xl text-gray-600 mb-6">
        Terima kasih telah berbelanja di AVAIL. Pesanan Anda sedang diproses.
      </p>
      <p class="text-lg text-gray-600">
        Anda akan diarahkan ke halaman utama...
      </p>
    </Card>
  </div>

  <!-- Checkout Form -->
  <div v-else class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-5xl font-bold text-[#2C4A2F] mb-12">
        Checkout
      </h1>

      <form @submit.prevent="handleSubmit">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Checkout Form -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Personal Information -->
            <Card class="p-8">

              <div class="flex items-center gap-3 mb-6">
                <User class="w-7 h-7 text-[#7BA87D]" />
                <h2 class="text-2xl font-bold text-gray-900">
                  Informasi Pribadi
                </h2>
              </div>

              <div class="space-y-5">

                <!-- Name -->
                <div>
                  <Label for="name" class="text-lg mb-2">
                    Nama Lengkap *
                  </Label>

                  <input id="name" name="name" v-model="checkoutStore.name" required
                    class="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
                    placeholder="Masukkan nama lengkap" />
                </div>

                <!-- Phone -->
                <div>
                  <Label for="phone" class="text-lg mb-2">
                    Nomor Telepon *
                  </Label>

                  <input id="phone" name="phone" type="tel" v-model="checkoutStore.phone" required
                    class="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
                    placeholder="08xxxxxxxxxx" />
                </div>

              </div>

            </Card>


            <!-- Shipping Address -->
            <Card class="p-8">

              <div class="flex items-center gap-3 mb-6">
                <MapPin class="w-7 h-7 text-[#7BA87D]" />
                <h2 class="text-2xl font-bold text-gray-900">
                  Alamat Pengiriman
                </h2>
              </div>

              <div class="space-y-5">

                <!-- Address -->
                <div>
                  <Label for="address" class="text-lg mb-2">
                    Alamat Lengkap *
                  </Label>

                  <textarea id="address" name="address" v-model="checkoutStore.address" required rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
                    placeholder="Jalan, No. Rumah, RT/RW" />
                </div>

                <div class="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label for="province" class="text-lg mb-2">
                      Provinsi *
                    </Label>
                    <ProvinceSelect v-model="checkoutStore.provinceId" :options="shippingStore.provinces"
                      placeholder="Pilih Provinsi" />
                  </div>

                  <div>
                    <Label for="city" class="text-lg mb-2">
                      Kota *
                    </Label>
                    <CitySelect 
                      v-model="checkoutStore.cityId" 
                      :cities="shippingStore.cities"
                      :loading="shippingStore.loadingCities" 
                      :disabled="!checkoutStore.provinceId" />
                  </div>
                </div>

                <div class="grid md:grid-cols-">
                  <div>
                    <Label for="postalCode" class="text-lg mb-2">
                      Kode Pos *
                    </Label>

                    <input id="postalCode" name="postalCode" v-model="checkoutStore.postalCode" required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
                      placeholder="12345" />
                  </div>
                </div>

                <!-- Notes -->
                <div>
                  <Label for="notes" class="text-lg mb-2">
                    Catatan (Opsional)
                  </Label>

                  <textarea id="notes" name="notes" v-model="checkoutStore.notes" rows="3"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
                    placeholder="Catatan untuk pengiriman" />
                </div>

              </div>

            </Card>

            <!-- Payment Method -->
            <Card class="p-8">
              <div class="flex items-center gap-3 mb-6">
                <Wallet class="w-7 h-7 text-[#7BA87D]" />
                <h2 class="text-2xl font-bold text-gray-900">
                  Metode Pembayaran
                </h2>
              </div>

              <div class="space-y-4">
                <!-- COD Option -->
                <div @click="checkoutStore.paymentMethod = 'cod'"
                  class="border-2 rounded-xl p-6 cursor-pointer transition-all hover:border-[#7BA87D] hover:bg-[#7BA87D]/5"
                  :class="checkoutStore.paymentMethod === 'cod' ? 'border-[#7BA87D] bg-[#7BA87D]/5' : 'border-gray-200'">
                  <div class="flex items-center gap-4">
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      :class="checkoutStore.paymentMethod === 'cod' ? 'border-[#7BA87D]' : 'border-gray-300'">
                      <div v-if="checkoutStore.paymentMethod === 'cod'" class="w-3 h-3 rounded-full bg-[#7BA87D]"></div>
                    </div>
                    <Home class="w-8 h-8 text-[#7BA87D]" />
                    <div class="flex-1">
                      <p class="text-xl font-bold text-gray-900">Bayar di Tempat (COD)</p>
                      <p class="text-base text-gray-600 mt-1">
                        Bayar langsung saat barang diterima
                      </p>
                    </div>
                  </div>
                </div>

                <!-- QRIS Option -->
                <div @click="checkoutStore.paymentMethod = 'qris'"
                  class="border-2 rounded-xl p-6 cursor-pointer transition-all hover:border-[#7BA87D] hover:bg-[#7BA87D]/5"
                  :class="checkoutStore.paymentMethod === 'qris' ? 'border-[#7BA87D] bg-[#7BA87D]/5' : 'border-gray-200'">
                  <div class="flex items-center gap-4">
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      :class="checkoutStore.paymentMethod === 'qris' ? 'border-[#7BA87D]' : 'border-gray-300'">
                      <div v-if="checkoutStore.paymentMethod === 'qris'" class="w-3 h-3 rounded-full bg-[#7BA87D]"></div>
                    </div>
                    <QrCode class="w-8 h-8 text-[#7BA87D]" />
                    <div class="flex-1">
                      <p class="text-xl font-bold text-gray-900">QRIS</p>
                      <p class="text-base text-gray-600 mt-1">
                        Scan QR untuk pembayaran instant
                      </p>
                    </div>
                  </div>
                </div>

                <!-- BCA Transfer Option -->
                <div @click="checkoutStore.paymentMethod = 'bank'"
                  class="border-2 rounded-xl p-6 cursor-pointer transition-all hover:border-[#7BA87D] hover:bg-[#7BA87D]/5"
                  :class="checkoutStore.paymentMethod === 'bank' ? 'border-[#7BA87D] bg-[#7BA87D]/5' : 'border-gray-200'">
                  <div class="flex items-center gap-4">
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                      :class="checkoutStore.paymentMethod === 'bank' ? 'border-[#7BA87D]' : 'border-gray-300'">
                      <div v-if="checkoutStore.paymentMethod === 'bank'" class="w-3 h-3 rounded-full bg-[#7BA87D]"></div>
                    </div>
                    <CreditCard class="w-8 h-8 text-[#7BA87D]" />
                    <div class="flex-1">

                      <!-- Header -->
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-xl font-bold text-gray-900">
                          Transfer Bank
                        </h3>
                      </div>

                      <p class="text-base text-gray-600 mb-4">
                        Transfer ke rekening kami
                      </p>

                      <!-- Bank Accounts -->
                      <div v-if="checkoutStore.paymentMethod === 'bank'" class="mt-4 space-y-4">

                        <p class="text-base text-gray-700 font-semibold">
                          Pilih salah satu rekening bank di bawah ini untuk transfer:
                        </p>

                        <!-- BCA -->
                        <div class="p-5 bg-white rounded-lg border-2 border-gray-200">
                          <div class="flex items-center gap-2 mb-3">
                            <CreditCard class="w-6 h-6 text-[#7BA87D]" />
                            <p class="text-lg font-bold">Bank BCA</p>
                          </div>

                          <p class="text-sm text-gray-600">Nomor Rekening</p>

                          <div class="flex justify-between items-center mt-1">

                            <p class="text-2xl font-bold">
                              {{ bankAccounts.BCA.accountNumber }}
                            </p>

                            <button @click.stop="handleCopyAccountNumber('BCA')" type="button"
                              class="bg-[#7BA87D] hover:bg-[#6A9570] text-white px-4 py-2 flex items-center rounded">

                              <component :is="copiedBank === 'BCA' ? Check : Copy" class="w-5 h-5 mr-2" />

                              {{ copiedBank === 'BCA' ? 'Tersalin' : 'Salin' }}

                            </button>

                          </div>

                          <p class="text-sm text-gray-600 mt-2">Atas Nama</p>
                          <p class="text-lg font-semibold">
                            {{ bankAccounts.BCA.accountName }}
                          </p>

                        </div>


                        <!-- Mandiri -->
                        <div class="p-5 bg-white rounded-lg border-2 border-gray-200">

                          <div class="flex items-center gap-2 mb-3">
                            <CreditCard class="w-6 h-6 text-[#7BA87D]" />
                            <p class="text-lg font-bold">Bank Mandiri</p>
                          </div>

                          <p class="text-sm text-gray-600">Nomor Rekening</p>

                          <div class="flex justify-between items-center mt-1">

                            <p class="text-2xl font-bold">
                              {{ bankAccounts.Mandiri.accountNumber }}
                            </p>

                            <button @click.stop="handleCopyAccountNumber('Mandiri')" type="button"
                              class="bg-[#7BA87D] hover:bg-[#6A9570] text-white px-4 py-2 flex items-center rounded">

                              <component :is="copiedBank === 'Mandiri' ? Check : Copy" class="w-5 h-5 mr-2" />

                              {{ copiedBank === 'Mandiri' ? 'Tersalin' : 'Salin' }}

                            </button>

                          </div>

                          <p class="text-sm text-gray-600 mt-2">Atas Nama</p>
                          <p class="text-lg font-semibold">
                            {{ bankAccounts.Mandiri.accountName }}
                          </p>

                        </div>


                        <!-- BNI -->
                        <div class="p-5 bg-white rounded-lg border-2 border-gray-200">

                          <div class="flex items-center gap-2 mb-3">
                            <CreditCard class="w-6 h-6 text-[#7BA87D]" />
                            <p class="text-lg font-bold">Bank BNI</p>
                          </div>

                          <p class="text-sm text-gray-600">Nomor Rekening</p>

                          <div class="flex justify-between items-center mt-1">

                            <p class="text-2xl font-bold">
                              {{ bankAccounts.BNI.accountNumber }}
                            </p>

                            <button @click.stop="handleCopyAccountNumber('BNI')" type="button"
                              class="bg-[#7BA87D] hover:bg-[#6A9570] text-white px-4 py-2 flex items-center rounded">

                              <component :is="copiedBank === 'BNI' ? Check : Copy" class="w-5 h-5 mr-2" />

                              {{ copiedBank === 'BNI' ? 'Tersalin' : 'Salin' }}

                            </button>

                          </div>

                          <p class="text-sm text-gray-600 mt-2">Atas Nama</p>
                          <p class="text-lg font-semibold">
                            {{ bankAccounts.BNI.accountName }}
                          </p>

                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <!-- QRIS Payment Details -->
            <Card v-if="checkoutStore.paymentMethod === 'qris'" class="p-8">
              <div class="flex items-center gap-3 mb-6">
                <QrCode class="w-7 h-7 text-[#7BA87D]" />
                <h2 class="text-2xl font-bold text-gray-900">
                  Pembayaran QRIS
                </h2>
              </div>

              <div class="space-y-5">
                <div class="bg-white border-3 border-[#7BA87D] rounded-xl p-8 text-center">
                  <div class="w-80 h-80 mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <div class="text-center">
                      <QrCode class="w-32 h-32 text-gray-400 mx-auto mb-4" />
                      <p class="text-lg text-gray-500">QR Code Pembayaran</p>
                    </div>
                  </div>
                  <p class="text-xl font-bold text-gray-900 mb-2">
                    Total: {{ formatPrice(checkoutStore.grandTotal) }}
                  </p>
                  <p class="text-base text-gray-600">
                    Scan QR Code menggunakan aplikasi e-wallet Anda
                  </p>
                </div>

                <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                  <div class="flex gap-3">
                    <div class="text-3xl">ℹ️</div>
                    <div class="flex-1">
                      <p class="text-lg font-bold text-blue-900 mb-2">
                        Cara Pembayaran QRIS:
                      </p>
                      <ol class="text-base text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Buka aplikasi e-wallet (GoPay, OVO, DANA, dll)</li>
                        <li>Pilih menu Scan/Bayar</li>
                        <li>Scan QR Code di atas</li>
                        <li>Konfirmasi pembayaran</li>
                        <li>Upload bukti pembayaran di bawah ini</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <!-- Courier Selection -->
            <CourierSelect
              v-model="checkoutStore.courierId"
              :couriers="shippingStore.couriers"
              :shippingCosts="shippingStore.shippingCosts"
              :loading="shippingStore.loadingShippingCosts"
              :paymentMethod="checkoutStore.paymentMethod"
            />

            <!-- Payment Proof Upload (for QRIS and BCA) -->
            <Card v-if="checkoutStore.paymentMethod === 'qris' || checkoutStore.paymentMethod === 'bank'" class="p-8">
              <div class="flex items-center gap-3 mb-6">
                <Upload class="w-7 h-7 text-[#7BA87D]" />
                <h2 class="text-2xl font-bold text-gray-900">
                  Upload Bukti Pembayaran
                </h2>
              </div>

              <div class="space-y-5">
                <p class="text-lg text-gray-600">
                  Setelah melakukan pembayaran via {{ checkoutStore.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank' }}, mohon
                  upload bukti pembayaran Anda di bawah ini:
                </p>

                <!-- Upload Area -->
                <div v-if="!paymentProofPreview"
                  class="border-3 border-dashed border-[#7BA87D] rounded-xl p-10 text-center bg-[#7BA87D]/5">
                  <input ref="fileInput" type="file" id="paymentProof" accept="image/*"
                    @change="handlePaymentProofChange" class="hidden" />
                  <label for="paymentProof" class="cursor-pointer flex flex-col items-center">
                    <div class="w-20 h-20 bg-[#7BA87D] rounded-full flex items-center justify-center mb-4">
                      <Upload class="w-10 h-10 text-white" />
                    </div>
                    <p class="text-2xl font-bold text-gray-900 mb-2">
                      Klik untuk Upload Bukti Bayar
                    </p>
                    <p class="text-lg text-gray-600 mb-4">
                      atau seret file gambar ke sini
                    </p>
                    <div class="bg-white px-8 py-4 rounded-lg border border-gray-200">
                      <p class="text-base text-gray-500">
                        Format: JPG, PNG, JPEG (Maks. 5MB)
                      </p>
                    </div>
                  </label>
                </div>

                <!-- Preview Area -->
                <div v-else class="border-2 border-[#7BA87D] rounded-xl p-6 bg-white">
                  <div class="flex items-start gap-4">
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Check class="w-7 h-7 text-green-600" />
                          </div>
                          <div>
                            <p class="text-xl font-bold text-gray-900">
                              Bukti Pembayaran Terupload
                            </p>
                            <p class="text-base text-gray-600">
                              {{ paymentProof?.name }}
                            </p>
                          </div>
                        </div>
                        <Button type="button" @click="handleRemovePaymentProof" variant="outline" size="sm"
                          class="border-red-300 text-red-600 hover:bg-red-50 px-4 py-2">
                          <X class="w-5 h-5 mr-2" />
                          Hapus
                        </Button>
                      </div>

                      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p class="text-sm text-gray-600 mb-3 font-semibold">
                          Preview Bukti Pembayaran:
                        </p>
                        <img :src="paymentProofPreview" alt="Bukti Pembayaran"
                          class="w-full max-h-96 object-contain rounded-lg border border-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
                  <div class="flex gap-3">
                    <div class="text-3xl">💡</div>
                    <div class="flex-1">
                      <p class="text-lg font-bold text-yellow-900 mb-2">
                        Tips Upload Bukti Bayar:
                      </p>
                      <ul class="text-base text-yellow-800 space-y-1 list-disc list-inside">
                        <li>Pastikan foto jelas dan tidak buram</li>
                        <li>Semua informasi pembayaran terlihat</li>
                        <li>Nominal transfer sesuai dengan total pesanan</li>
                        <li>Format file: JPG, PNG, atau JPEG (maksimal 5MB)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <!-- Order Summary (Sticky Sidebar) -->
          <div class="lg:col-span-1">
            <Card class="p-8 sticky top-24">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">
                Ringkasan Pesanan
              </h2>

              <!-- Items -->
              <div class="space-y-4 mb-6 max-h-64 overflow-y-auto">
                <div v-for="item in cart" :key="item.id" class="flex gap-3">
                  <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="text-base font-semibold text-gray-900 truncate">
                      {{ item.name }}
                    </h3>
                    <p class="text-sm text-gray-600">
                      {{ item.quantity }}x @ Rp {{ item.price.toLocaleString('id-ID') }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Totals -->
              <div class="space-y-3 mb-6 border-t pt-4">
                <div class="flex justify-between text-lg">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-semibold">
                    {{ formatPrice(checkoutStore.subtotal) }}
                  </span>
                </div>
                <div class="flex justify-between text-lg">
                  <span class="text-gray-600">Ongkir</span>
                  <span v-if="shippingStore.loadingShippingCosts">
                    Menghitung...
                  </span>

                  <!-- Has shipping cost -->
                  <span v-else-if="checkoutStore.shippingCost != 0">
                    {{ formatPrice(checkoutStore.shippingCost) }}
                  </span>

                  <!-- Free shipping -->
                  <span
                    v-else
                    class="font-semibold text-green-600"
                  >
                    GRATIS
                  </span>
                </div>
                <div class="border-t pt-3">
                  <div class="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span class="text-[#7BA87D]">
                      {{ formatPrice(checkoutStore.grandTotal) }}
                    </span>
                  </div>
                </div>
              </div>

              <Button type="submit" :disabled="isProcessing" variant="success" size="lg">
                <template v-if="isProcessing">
                  <span class="animate-spin mr-2">⏳</span>
                  Memproses...
                </template>
                <template v-else>
                  <CheckCircle class="w-6 h-6 mr-2" />
                  Konfirmasi Pesanan
                </template>
              </Button>

              <div v-if="checkoutStore.paymentMethod === 'cod'" class="mt-6 p-4 bg-green-50 rounded-lg">
                <p class="text-sm text-green-800 text-center">
                  ✅ Bayar saat barang diterima
                </p>
              </div>

              <div v-if="checkoutStore.paymentMethod === 'qris'" class="mt-6 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-800 text-center">
                  📱 Silakan scan QR Code untuk pembayaran
                </p>
              </div>

              <div v-if="checkoutStore.paymentMethod === 'bank'" class="mt-6 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-800 text-center">
                  🏦 Transfer ke rekening bank yang tertera
                </p>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  CheckCircle, MapPin, User, Phone, Home, Wallet,
  QrCode, CreditCard, Copy, Check, Upload, X
} from 'lucide-vue-next'
import { useCartStore } from '../stores/cart'
import { useShippingStore } from '../stores/shipping'
import { useCheckoutStore } from '../stores/checkout'
import { useProducts } from '../composables/useProducts'

import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import Input from '../components/ui/Input.vue'
import Label from '../components/ui/Label.vue'
import ProvinceSelect from '../components/ProvinceSelect.vue'
import CitySelect from '../components/CitySelect.vue'
import CourierSelect from '../components/CourierSelect.vue'

const router = useRouter()
const cartStore = useCartStore()
const shippingStore = useShippingStore()
const checkoutStore = useCheckoutStore()
const { formatPrice } = useProducts()

// Reactive state
const isProcessing = ref(false)
const isSuccess = ref(false)
const copiedBank = ref(null)
const paymentProof = ref(null)
const paymentProofPreview = ref(null)
const fileInput = ref(null)

// computed selected courier cost
const selectedShippingCost = computed(() => {
  if (!shippingStore.selectedCourierId)
    return null

  return shippingStore.shippingCosts[shippingStore.selectedCourierId] || null
})

// Bank account data
const bankAccounts = {
  BCA: {
    accountNumber: '1234567890',
    accountName: 'AVAIL INDONESIA',
    bankName: 'BCA',
  },
  Mandiri: {
    accountNumber: '0987654321',
    accountName: 'AVAIL INDONESIA',
    bankName: 'Mandiri',
  },
  BNI: {
    accountNumber: '5556667778',
    accountName: 'AVAIL INDONESIA',
    bankName: 'BNI',
  },
}

const cart = cartStore.items

// Redirect to cart if empty and not in success state
watch(() => cart.length, (newLength) => {
  if (newLength === 0 && !isSuccess.value) {
    router.push('/cart')
  }
})

// when province change
watch(() => checkoutStore.provinceId, async (provinceId) => {
  // shippingStore.clearCities()

  shippingStore.selectedCityId = ""
  shippingStore.selectedCourierId = ""

  shippingStore.clearShippingCosts()

  if (provinceId)
    await shippingStore.fetchCities(provinceId)
})

// when city
watch(() => checkoutStore.cityId, async (cityId) => {
    shippingStore.selectedCourierId = ""
    shippingStore.clearShippingCosts()

    if (cityId)
      await shippingStore.fetchShippingCosts(cityId)
  }
)

watch(() => checkoutStore.courierId, (courierId) => {
    const cost =
      shippingStore.shippingCosts[courierId]

    if (cost) {
      checkoutStore.setShipping(
        cost.price,
        cost.etd
      )
    }
  }
)

// when payment method change
watch(() => checkoutStore.paymentMethod, (method) => {
  if (method === "cod") {
    checkoutStore.courierId = ""
    shippingStore.clearShippingCosts()
  }
})

onMounted(async () => {
  if (cartStore.items.length === 0 && !isSuccess.value) {
    router.push('/cart')
  }

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

  // restore selected shipping costs
  if (
    checkoutStore.cityId &&
    Object.keys(shippingStore.shippingCosts).length === 0
  ) {
    await shippingStore.fetchShippingCosts(
      checkoutStore.cityId
    )
  }
})

// Methods
function handleSubmit() {
  isProcessing.value = true

  // Simulate processing
  setTimeout(() => {
    isProcessing.value = false
    isSuccess.value = true
    cartStore.clearCart()
    checkoutStore.resetAfterCheckout()

    // Redirect after success
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }, 2000)
}

function handleCopyAccountNumber(bankName) {
  navigator.clipboard.writeText(bankAccounts[bankName].accountNumber)
  copiedBank.value = bankName
  setTimeout(() => {
    copiedBank.value = null
  }, 2000)
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
</script>
