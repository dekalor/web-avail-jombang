<template>
  <div class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl sm:text-4xl lg:text-5xl font-bold text-[#2C4A2F] mb-12">
        Checkout
      </h1>

      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Checkout Form -->
          <div class="lg:col-span-2 space-y-6 min-w-0">
            <!-- Personal Information -->
            <Card>

              <div class="flex items-center gap-3 mb-6">
                <User class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D]" />
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
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
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
                    placeholder="Masukkan nama lengkap" />
                </div>

                <!-- Phone -->
                <div>
                  <Label for="phone" class="text-lg mb-2">
                    Nomor Telepon *
                  </Label>

                  <input id="phone" name="phone" type="tel" v-model="checkoutStore.phone" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
                    placeholder="08xxxxxxxxxx" />
                </div>

              </div>

            </Card>


            <!-- Shipping Address -->
            <Card>
              <div class="flex items-center gap-3 mb-6">
                <MapPin class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D]" />
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
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

                <div class="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label for="district" class="text-lg mb-2">
                      Kecamatan *
                    </Label>
                    <DistrictSelect 
                      v-model="checkoutStore.districtId" 
                      :districts="shippingStore.districts"
                      :loading="shippingStore.loadingDistricts" 
                      :disabled="!checkoutStore.cityId" />
                  </div>

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
            <Card class="p-4 sm:p-6 lg:p-8 overflow-hidden">
              <div class="flex items-center gap-3 mb-6">
                <Wallet class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D]" />
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
                  Metode Pembayaran
                </h2>
              </div>

              <div class="space-y-4">

                <!-- COD Option -->
                <div
                  @click="checkoutStore.paymentMethod = 'cod'"
                  class="border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:border-[#7BA87D] hover:bg-[#7BA87D]/5"
                  :class="checkoutStore.paymentMethod === 'cod'
                    ? 'border-[#7BA87D] bg-[#7BA87D]/5'
                    : 'border-gray-200'"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">

                    <!-- Radio (hidden on mobile) -->
                    <div
                      class="hidden sm:flex w-6 h-6 rounded-full border-2 items-center justify-center flex-shrink-0"
                      :class="checkoutStore.paymentMethod === 'cod'
                        ? 'border-[#7BA87D]'
                        : 'border-gray-300'"
                    >
                      <div
                        v-if="checkoutStore.paymentMethod === 'cod'"
                        class="w-3 h-3 rounded-full bg-[#7BA87D]"
                      ></div>
                    </div>

                    <!-- Icon -->
                    <Home class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D] flex-shrink-0" />

                    <!-- Text -->
                    <div class="flex-1 min-w-0">
                      <p class="text-lg sm:text-xl font-bold text-gray-900">
                        Bayar di Tempat (COD)
                      </p>
                      <p class="text-sm sm:text-base text-gray-600 mt-1">
                        Bayar langsung saat barang diterima
                      </p>
                    </div>

                  </div>
                </div>


                <!-- QRIS Option -->
                <div
                  @click="checkoutStore.paymentMethod = 'qris'"
                  class="border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:border-[#7BA87D] hover:bg-[#7BA87D]/5"
                  :class="checkoutStore.paymentMethod === 'qris'
                    ? 'border-[#7BA87D] bg-[#7BA87D]/5'
                    : 'border-gray-200'"
                >
                  <div class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">

                    <!-- Radio (hidden on mobile) -->
                    <div
                      class="hidden sm:flex w-6 h-6 rounded-full border-2 items-center justify-center flex-shrink-0"
                      :class="checkoutStore.paymentMethod === 'qris'
                        ? 'border-[#7BA87D]'
                        : 'border-gray-300'"
                    >
                      <div
                        v-if="checkoutStore.paymentMethod === 'qris'"
                        class="w-3 h-3 rounded-full bg-[#7BA87D]"
                      ></div>
                    </div>

                    <!-- Icon -->
                    <QrCode class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D] flex-shrink-0" />

                    <!-- Text -->
                    <div class="flex-1 min-w-0">
                      <p class="text-lg sm:text-xl font-bold text-gray-900">
                        QRIS
                      </p>
                      <p class="text-sm sm:text-base text-gray-600 mt-1">
                        Scan QR untuk pembayaran instant
                      </p>
                    </div>

                  </div>
                </div>


                <!-- Bank Transfer Option -->
                <div
                  @click="checkoutStore.paymentMethod = 'bank'"
                  class="border-2 rounded-xl p-4 sm:p-6 cursor-pointer transition-all hover:border-[#7BA87D] hover:bg-[#7BA87D]/5"
                  :class="checkoutStore.paymentMethod === 'bank'
                    ? 'border-[#7BA87D] bg-[#7BA87D]/5'
                    : 'border-gray-200'"
                >
                  <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 min-w-0">

                    <!-- Radio (hidden on mobile) -->
                    <div
                      class="hidden sm:flex w-6 h-6 rounded-full border-2 items-center justify-center flex-shrink-0 mt-1"
                      :class="checkoutStore.paymentMethod === 'bank'
                        ? 'border-[#7BA87D]'
                        : 'border-gray-300'"
                    >
                      <div
                        v-if="checkoutStore.paymentMethod === 'bank'"
                        class="w-3 h-3 rounded-full bg-[#7BA87D]"
                      ></div>
                    </div>

                    <!-- Icon -->
                    <CreditCard class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D] flex-shrink-0 mt-1" />

                    <!-- Content -->
                    <div class="flex-1 min-w-0">

                      <h3 class="text-lg sm:text-xl font-bold text-gray-900">
                        Transfer Bank
                      </h3>

                      <p :class="[
                        'text-sm sm:text-base text-gray-600',

                        checkoutStore.paymentMethod === 'bank' ?? 'mb-4'
                      ]">
                        Transfer ke rekening kami
                      </p>

                      <!-- Bank Accounts -->
                      <div
                        v-if="checkoutStore.paymentMethod === 'bank'"
                        class="mt-4 space-y-4"
                      >

                        <p class="text-sm sm:text-base text-gray-700 font-semibold">
                          Pilih salah satu rekening bank di bawah ini untuk transfer:
                        </p>

                        <!-- BCA -->
                        <div v-for="bank in bankAccounts" :key="bank.name" class="p-4 sm:p-5 bg-white rounded-lg border-2 border-gray-200">
                          <div class="flex items-center gap-2 mb-2">
                            <CreditCard class="w-5 h-5 text-[#7BA87D]" />
                            <p class="text-base sm:text-lg font-bold">Bank {{ bank.name }}</p>
                          </div>

                          <p class="text-sm text-gray-600">Nomor Rekening</p>

                          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-1">
                            <p class="text-base sm:text-xl font-bold break-all">
                              {{ bank.accountNumber }}
                            </p>

                            <button
                              @click.stop="handleCopyAccountNumber(bank.name)"
                              type="button"
                              class="bg-[#7BA87D] hover:bg-[#6A9570] text-white px-4 py-2 flex items-center justify-center rounded w-full sm:w-auto"
                            >
                              <component
                                :is="copiedBank === bank.name ? Check : Copy"
                                class="w-4 h-4 mr-2"
                              />
                              {{ copiedBank === bank.name ? 'Tersalin' : 'Salin' }}
                            </button>
                          </div>

                          <p class="text-sm text-gray-600 mt-2">Atas Nama</p>
                          <p class="text-base sm:text-lg font-semibold">
                            {{ bank.accountName }}
                          </p>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </Card>

            <!-- QRIS Payment Details -->
            <Card v-if="checkoutStore.paymentMethod === 'qris'">
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
                      <QrCode class="w-32 h-32 text-gray-400 mx-auto mb-4" />
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

            <!-- Courier Selection -->
            <CourierSelect
              v-model="checkoutStore.courierCode"
              :couriers="shippingStore.couriers"
              :shippingCosts="shippingStore.shippingCosts"
              :loading="shippingStore.loadingShippingCosts"
              :paymentMethod="checkoutStore.paymentMethod"
            />

            <!-- Payment Proof Upload (for QRIS and BCA) -->
            <Card
              v-if="checkoutStore.paymentMethod === 'qris' || checkoutStore.paymentMethod === 'bank'"
              class="p-4 sm:p-6 lg:p-8 overflow-hidden"
            >
              <!-- Header -->
              <div class="flex items-center gap-3 mb-4 sm:mb-6">
                <Upload class="w-5 h-5 sm:w-7 sm:h-7 text-[#7BA87D]" />
                <h2 class="text-lg sm:text-2xl font-bold text-gray-900">
                  Upload Bukti Pembayaran
                </h2>
              </div>

              <div class="space-y-4 sm:space-y-5">

                <!-- Description -->
                <p class="text-sm sm:text-base lg:text-lg text-gray-600">
                  Setelah melakukan pembayaran via
                  {{ checkoutStore.paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank' }},
                  mohon upload bukti pembayaran Anda di bawah ini:
                </p>


                <!-- Upload Area -->
                <div
                  v-if="!paymentProofPreview"
                  class="border-2 sm:border-3 border-dashed border-[#7BA87D] rounded-xl p-6 sm:p-8 lg:p-10 text-center bg-[#7BA87D]/5"
                >

                  <input
                    ref="fileInput"
                    type="file"
                    id="paymentProof"
                    accept="image/*"
                    @change="handlePaymentProofChange"
                    class="hidden"
                  />

                  <label
                    for="paymentProof"
                    class="cursor-pointer flex flex-col items-center"
                  >

                    <!-- Upload Icon -->
                    <div
                      class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#7BA87D] rounded-full flex items-center justify-center mb-3 sm:mb-4"
                    >
                      <Upload class="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                    </div>

                    <!-- Title -->
                    <p class="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 text-center">
                      Klik untuk Upload Bukti Bayar
                    </p>

                    <!-- Subtitle -->
                    <p class="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 text-center">
                      atau seret file gambar ke sini
                    </p>

                    <!-- Format info -->
                    <div
                      class="bg-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg border border-gray-200"
                    >
                      <p class="text-xs sm:text-sm lg:text-base text-gray-500">
                        Format: JPG, PNG, JPEG (Maks. 5MB)
                      </p>
                    </div>

                  </label>
                </div>


                <!-- Preview Area -->
                <div
                  v-else
                  class="border-2 border-[#7BA87D] rounded-xl p-4 sm:p-6 bg-white"
                >

                  <div class="flex flex-col gap-4">

                    <!-- Header row responsive -->
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      <!-- Left info -->
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
                            {{ paymentProof?.name }}
                          </p>
                        </div>

                      </div>

                      <!-- Remove button -->
                      <Button
                        type="button"
                        @click="handleRemovePaymentProof"
                        variant="outline"
                        size="sm"
                        class="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto justify-center"
                      >
                        <X class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Hapus
                      </Button>

                    </div>


                    <!-- Preview image -->
                    <div
                      class="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
                    >
                      <p class="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 font-semibold">
                        Preview Bukti Pembayaran:
                      </p>

                      <img
                        :src="paymentProofPreview"
                        alt="Bukti Pembayaran"
                        class="w-full max-h-64 sm:max-h-80 lg:max-h-96 object-contain rounded-lg border border-gray-300"
                      />
                    </div>

                  </div>

                </div>


                <!-- Tips -->
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
          </div>

          <!-- Order Summary (Sticky Sidebar) -->
          <div class="lg:col-span-1 min-w-0">
            <Card
              class="w-full max-w-full p-4 sm:p-6 lg:p-6
                    lg:sticky lg:top-24"
            >

              <!-- Title -->
              <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Ringkasan Pesanan
              </h2>


              <!-- Items -->
              <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto pr-1">

                <div
                  v-for="item in cart"
                  :key="item.id"
                  class="flex gap-3 min-w-0 items-center"
                >

                  <!-- Image -->
                  <div class="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      :src="item.imageUrl"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0">

                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {{ item.name }}
                    </h3>

                    <p class="text-xs sm:text-sm text-gray-600 truncate">
                      {{ item.quantity }}x @ Rp {{ item.price.toLocaleString('id-ID') }}
                    </p>

                  </div>

                </div>

              </div>


              <!-- Totals -->
              <div class="space-y-2 sm:space-y-3 mb-4 sm:mb-6 border-t pt-3 sm:pt-4">

                <div class="flex justify-between text-sm sm:text-base lg:text-lg gap-3">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-semibold text-right break-all">
                    {{ formatPrice(checkoutStore.subtotal) }}
                  </span>
                </div>

                <div class="flex justify-between text-sm sm:text-base lg:text-lg">
                  <span class="text-gray-600">Total Berat</span>
                  <span class="font-semibold">{{ formatWeight(cartStore.totalWeight) }}</span>
                </div>

                <div class="flex justify-between text-sm sm:text-base lg:text-lg gap-3">

                  <span class="text-gray-600">Ongkir</span>

                  <span v-if="shippingStore.loadingShippingCosts">
                    <div class="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </span>

                  <span
                    v-else-if="checkoutStore.shippingCost !== 0"
                    class="font-semibold text-right break-all"
                  >
                    {{ formatPrice(checkoutStore.shippingCost) }}
                  </span>

                  <span
                    v-else-if="checkoutStore.paymentMethod === 'cod'"
                    class="font-semibold text-green-600"
                  >
                    GRATIS
                  </span>

                  <span 
                    v-else
                    class="font-semibold text-right break-all"
                  >
                  -
                  </span>

                </div>


                <div class="border-t pt-3">

                  <div class="flex justify-between items-start gap-3">

                    <span class="text-base sm:text-xl lg:text-2xl font-bold">
                      Total
                    </span>

                    <span class="text-lg sm:text-xl lg:text-2xl font-bold text-[#7BA87D] text-right break-all">
                      {{ formatPrice(checkoutStore.grandTotal) }}
                    </span>

                  </div>

                </div>

              </div>


              <!-- Button -->
              <Button
                type="submit"
                :disabled="isProcessing"
                variant="success"
                size="lg"
                class="w-full justify-center"
              >

                <template v-if="isProcessing">
                  <span class="animate-spin mr-2">⏳</span>
                  Memproses...
                </template>

                <template v-else>
                  <CheckCircle class="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Konfirmasi Pesanan
                </template>

              </Button>


              <!-- Payment info -->
              <div
                v-if="checkoutStore.paymentMethod === 'cod'"
                class="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg"
              >
                <p class="text-xs sm:text-sm text-green-800 text-center">
                  ✅ Bayar saat barang diterima
                </p>
              </div>


              <div
                v-if="checkoutStore.paymentMethod === 'qris'"
                class="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg"
              >
                <p class="text-xs sm:text-sm text-blue-800 text-center">
                  📱 Silakan scan QR Code untuk pembayaran
                </p>
              </div>


              <div
                v-if="checkoutStore.paymentMethod === 'bank'"
                class="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg"
              >
                <p class="text-xs sm:text-sm text-blue-800 text-center">
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
import { useCartStore } from '../stores/cartStore'
import { useShippingStore } from '../stores/shippingStore'
import { useCheckoutStore } from '../stores/checkoutStore'
import { useProducts } from '../composables/useProducts'

import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import Input from '../components/ui/Input.vue'
import Label from '../components/ui/Label.vue'
import ProvinceSelect from '../components/ProvinceSelect.vue'
import CitySelect from '../components/CitySelect.vue'
import DistrictSelect from '../components/DistrictSelect.vue'
import CourierSelect from '../components/CourierSelect.vue'

const router = useRouter()
const cartStore = useCartStore()
const shippingStore = useShippingStore()
const checkoutStore = useCheckoutStore()
const { formatPrice } = useProducts()
const { formatPrice, formatWeight } = useProducts()

// Reactive state
const isProcessing = ref(false)
const isSuccess = ref(false)
const copiedBank = ref(null)
const paymentProof = ref(null)
const paymentProofPreview = ref(null)
const fileInput = ref(null)

// Bank account data
const bankAccounts = [{
    name: 'BCA',
    accountNumber: '1234567890',
    accountName: 'AVAIL INDONESIA',
  },{
    name: 'Mandiri',
    accountNumber: '0987654321',
    accountName: 'AVAIL INDONESIA',
  },{
    name: 'BNI',
    accountNumber: '5556667778',
    accountName: 'AVAIL INDONESIA',
  }
]

const cart = cartStore.items

// Redirect to cart if empty and not in success state
watch(() => cart.length, (newLength) => {
  if (newLength === 0 && !isSuccess.value) {
    router.push('/cart')
  }
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
watch(() => checkoutStore.paymentMethod, (method) => {
  if (method === "cod") {
    checkoutStore.courierCode = ""
    checkoutStore.clearShipping()
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
function handleSubmit() {
  isProcessing.value = true

  // Simulate processing
  setTimeout(() => {
    isProcessing.value = false
    isSuccess.value = true
    cartStore.clearCart()
    checkoutStore.resetAfterCheckout()

    // Redirect after success
    router.push('/order-success')
  }, 2000)
}

function handleCopyAccountNumber(bankName) {
  const bank = bankAccounts.find(b => b.name === bankName)
  navigator.clipboard.writeText(bank.accountNumber)
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

function setShipping(courierCode) {
  const cost = shippingStore.shippingCosts[courierCode]
  if (cost) {
    checkoutStore.setShipping(
      cost.price,
      cost.etd
    )
  }
}
</script>
