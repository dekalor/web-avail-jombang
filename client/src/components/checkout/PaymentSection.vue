<template>
  <Card class="p-4 sm:p-6 lg:p-8 overflow-hidden">
    <div class="flex items-center gap-3 mb-6">
      <Wallet class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D]" />
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
        Metode Pembayaran
      </h2>
    </div>

    <p
      v-if="!isCodAvailable"
      class="mb-4 text-sm sm:text-base text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"
    >
      Metode pembayaran COD hanya tersedia untuk kota Jombang.
    </p>

    <div v-for="paymentMethod in checkoutStore.paymentMethods" :key="paymentMethod.id" class="space-y-4">
      <div
        @click="selectPaymentMethod(paymentMethod)"
        class="border-2 rounded-xl p-4 sm:p-6 transition-all"
        :class="[
          checkoutStore.paymentMethodType === paymentMethod.type
            ? 'border-[#7BA87D] bg-[#7BA87D]/5'
            : 'border-gray-200',
          canSelectCod(paymentMethod.type)
            ? 'cursor-pointer hover:border-[#7BA87D] hover:bg-[#7BA87D]/5'
            : 'cursor-not-allowed opacity-60'
        ]"
      >
        <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
          <div
            class="hidden sm:flex w-6 h-6 rounded-full border-2 items-center justify-center flex-shrink-0"
            :class="checkoutStore.paymentMethodType === paymentMethod.type
              ? 'border-[#7BA87D]'
              : 'border-gray-300'"
          >
            <div
              v-if="checkoutStore.paymentMethodType === paymentMethod.type"
              class="w-3 h-3 rounded-full bg-[#7BA87D]"
            ></div>
          </div>

          <Home v-if="paymentMethod.type === 'cod'" class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D] flex-shrink-0" />
          <QrCode v-else-if="paymentMethod.type === 'qris'" class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D] flex-shrink-0" />
          <CreditCard v-else class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D] flex-shrink-0" />

          <div class="flex-1 min-w-0">
            <p class="text-lg sm:text-xl font-bold text-gray-900">
              {{ paymentMethod.type === 'bank' ? 'Transfer Bank' : paymentMethod.name }}
            </p>
            <p class="text-sm sm:text-base text-gray-600">
              {{ paymentMethod.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Card>

  <Card
    v-if="checkoutStore.paymentMethodType === 'bank'"
    class="p-4 sm:p-6 lg:p-8 overflow-hidden"
  >
    <div class="flex items-center gap-3 mb-6">
      <CreditCard class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D]" />
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
        Pilih Rekening Bank
      </h2>
    </div>

    <div
      v-for="bank in checkoutStore.bankAccounts"
      :key="bank.id"
      @click="setPaymentMethod(bank.id)"
      class="flex items-center gap-4 p-4 sm:p-5 bg-white rounded-lg border-2 cursor-pointer transition-all"
      :class="checkoutStore.paymentMethod === bank.id
        ? 'border-[#7BA87D] bg-[#7BA87D]/5'
        : 'border-gray-200 hover:border-[#7BA87D]/50'"
    >
      <div
        class="hidden sm:flex w-6 h-6 rounded-full border-2 items-center justify-center flex-shrink-0"
        :class="checkoutStore.paymentMethod === bank.id
          ? 'border-[#7BA87D]'
          : 'border-gray-300'"
      >
        <div
          v-if="checkoutStore.paymentMethod === bank.id"
          class="w-3 h-3 rounded-full bg-[#7BA87D]"
        ></div>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="flex items-center gap-2 mb-2">
          <CreditCard class="w-5 h-5 text-[#7BA87D]" />
          <p class="text-base sm:text-lg font-bold">{{ bank.name }}</p>
        </div>

        <p class="text-sm text-gray-600">Nomor Rekening</p>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-1">
          <p class="text-base sm:text-xl font-bold break-all">
            {{ bank.accountNumber }}
          </p>

          <button
            @click.stop="handleCopyAccountNumber(bank.id)"
            type="button"
            class="hidden sm:flex bg-[#7BA87D] hover:bg-[#6A9570] text-white px-4 py-2 items-center justify-center rounded"
          >
            <component
              :is="copiedBank === bank.id ? Check : Copy"
              class="w-4 h-4 mr-2"
            />
            {{ copiedBank === bank.id ? 'Tersalin' : 'Salin' }}
          </button>
        </div>

        <p class="text-sm text-gray-600 mt-3">Atas Nama</p>
        <p class="text-base sm:text-lg font-semibold">
          {{ bank.accountName }}
        </p>

        <button
          @click.stop="handleCopyAccountNumber(bank.id)"
          type="button"
          class="sm:hidden mt-4 bg-[#7BA87D] hover:bg-[#6A9570] text-white px-4 py-2 flex items-center justify-center rounded w-full"
        >
          <component
            :is="copiedBank === bank.id ? Check : Copy"
            class="w-4 h-4 mr-2"
          />
          {{ copiedBank === bank.id ? 'Tersalin' : 'Salin Nomor Rekening' }}
        </button>
      </div>
    </div>
  </Card>

  <Card v-if="checkoutStore.paymentMethodType === 'qris'">
    <div class="flex items-center gap-3 mb-6">
      <QrCode class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D]" />
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
        Pembayaran QRIS
      </h2>
    </div>

    <div class="space-y-5">
      <div class="bg-white border-3 border-[#7BA87D] rounded-xl p-8 text-center">
        <div class="w-full max-w-xs aspect-square mx-auto bg-gray-100 rounded-xl flex items-center justify-center mb-4">
          <div class="text-center">
            <img src="https://res.cloudinary.com/drp8mahwc/image/upload/v1773041989/QRCode_vomxvk.jpg">
            <p class="text-lg text-gray-500">QR Code Pembayaran</p>
          </div>
        </div>
        <p class="text-lg sm:text-xl font-bold text-gray-900">
          Total: {{ formatPrice(checkoutStore.grandTotal) }}
        </p>
        <p class="text-sm sm:text-base text-gray-600">
          Scan QR Code menggunakan aplikasi e-wallet Anda
        </p>
      </div>

      <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
        <div class="flex gap-3">
          <div class="text-2xl sm:text-3xl">ℹ️</div>
          <div class="flex-1">
            <p class="text-lg sm:text-xl font-bold text-blue-900 mb-2">
              Cara Pembayaran QRIS:
            </p>
            <ol class="text-sm sm:text-base text-blue-800 space-y-1 list-decimal list-inside">
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

  <CourierSelect
    v-model="checkoutStore.courierCode"
    :couriers="shippingStore.couriers"
    :shippingCosts="shippingStore.shippingCosts"
    :loading="shippingStore.loadingShippingCosts"
    :paymentMethod="checkoutStore.paymentMethodType"
    :isFreeShippingEligible="checkoutStore.isFreeShippingEligible"
  />

  <Card
    v-if="checkoutStore.paymentMethodType === 'qris' || checkoutStore.paymentMethodType === 'bank'"
    class="p-4 sm:p-6 lg:p-8 overflow-hidden"
  >
    <div class="flex items-center gap-3 mb-4 sm:mb-6">
      <Upload class="w-5 h-5 sm:w-7 sm:h-7 text-[#7BA87D]" />
      <h2 class="text-lg sm:text-2xl font-bold text-gray-900">
        Upload Bukti Pembayaran
      </h2>
    </div>

    <div class="space-y-4 sm:space-y-5">
      <p class="text-sm sm:text-base lg:text-lg text-gray-600">
        Setelah melakukan pembayaran via
        {{ checkoutStore.paymentMethodType === 'qris' ? 'QRIS' : 'Transfer Bank' }},
        mohon upload bukti pembayaran Anda di bawah ini:
      </p>

      <div
        v-if="!checkoutStore.paymentProofPreview"
        class="border-2 sm:border-3 border-dashed border-[#7BA87D] rounded-xl p-6 sm:p-8 lg:p-10 text-center bg-[#7BA87D]/5"
      >
        <input
          :ref="(el) => { checkoutStore.fileInput = el }"
          type="file"
          id="paymentProof"
          accept="image/*"
          @change="checkoutStore.handlePaymentProofChange"
          class="hidden"
        />

        <label
          for="paymentProof"
          class="cursor-pointer flex flex-col items-center"
        >
          <div
            class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#7BA87D] rounded-full flex items-center justify-center mb-3 sm:mb-4"
          >
            <Upload class="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
          </div>

          <p class="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 text-center">
            Klik untuk Upload Bukti Bayar
          </p>

          <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 text-center">
            atau seret file gambar ke sini
          </p>

          <div
            class="bg-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg border border-gray-200"
          >
            <p class="text-xs sm:text-sm lg:text-base text-gray-500">
              Format: JPG, PNG, JPEG (Maks. 5MB)
            </p>
          </div>
        </label>
      </div>

      <div
        v-else
        class="border-2 border-[#7BA87D] rounded-xl p-4 sm:p-6 bg-white"
      >
        <div class="flex flex-col gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <Check class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>

              <div class="min-w-0">
                <p class="text-base sm:text-xl font-bold text-gray-900 truncate">
                  Bukti Pembayaran Terupload
                </p>

                <p class="text-xs sm:text-base text-gray-600 truncate">
                  {{ checkoutStore.paymentProof?.name }}
                </p>
              </div>
            </div>

            <Button
              type="button"
              @click="checkoutStore.handleRemovePaymentProof"
              variant="outline"
              size="sm"
              class="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto justify-center"
            >
              <X class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Hapus
            </Button>
          </div>

          <div
            class="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
          >
            <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-semibold">
              Preview Bukti Pembayaran:
            </p>

            <img
              :src="checkoutStore.paymentProofPreview"
              alt="Bukti Pembayaran"
              class="w-full max-h-64 sm:max-h-80 lg:max-h-96 object-contain rounded-lg border border-gray-300"
            />
          </div>
        </div>
      </div>

      <div
        class="bg-yellow-50 border border-yellow-200 sm:border-2 rounded-xl p-4 sm:p-5"
      >
        <div class="flex gap-3">
          <div class="text-xl sm:text-2xl lg:text-3xl">💡</div>
          <div class="flex-1">
            <p class="text-sm sm:text-base lg:text-lg font-bold text-yellow-900 mb-2">
              Tips Upload Bukti Bayar:
            </p>
            <ul
              class="text-xs sm:text-sm lg:text-base text-yellow-800 space-y-1 list-disc list-inside"
            >
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
</template>

<script setup>
import { Home, Wallet, QrCode, CreditCard, Copy, Check, Upload, X } from 'lucide-vue-next'
import Button from '../ui/Button.vue'
import Card from '../ui/Card.vue'
import CourierSelect from '../CourierSelect.vue'

defineProps({
  checkoutStore: {
    type: Object,
    required: true,
  },
  shippingStore: {
    type: Object,
    required: true,
  },
  copiedBank: {
    type: [Number, String, null],
    default: null,
  },
  isCodAvailable: {
    type: Boolean,
    required: true,
  },
  canSelectCod: {
    type: Function,
    required: true,
  },
  selectPaymentMethod: {
    type: Function,
    required: true,
  },
  setPaymentMethod: {
    type: Function,
    required: true,
  },
  handleCopyAccountNumber: {
    type: Function,
    required: true,
  },
  formatPrice: {
    type: Function,
    required: true,
  },
})
</script>
