<template>
  <Card>
    <div class="flex items-center gap-3 mb-6">
      <MapPin class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D]" />
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
        Alamat Pengiriman
      </h2>
    </div>

    <div class="space-y-5">
      <div class="grid md:grid-cols-2 gap-5">
        <div>
          <Label for="province" class="text-lg mb-2">
            Provinsi *
          </Label>
          <ProvinceSelect
            v-model="checkoutStore.provinceId"
            :options="shippingStore.provinces"
            placeholder="Pilih Provinsi"
          />
        </div>

        <div>
          <Label for="city" class="text-lg mb-2">
            Kota *
          </Label>
          <CitySelect
            v-model="checkoutStore.cityId"
            :cities="shippingStore.cities"
            :loading="shippingStore.loadingCities"
            :disabled="!checkoutStore.provinceId"
          />
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
            :disabled="!checkoutStore.cityId"
          />
        </div>

        <div>
          <Label for="postalCode" class="text-lg mb-2">
            Kode Pos *
          </Label>

          <input
            id="postalCode"
            name="postalCode"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            v-model="checkoutStore.postalCode"
            @input="filterNumber"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
            placeholder="12345"
          />
        </div>
      </div>

      <div>
        <Label for="address" class="text-lg mb-2">
          Alamat Lengkap *
        </Label>

        <textarea
          id="address"
          name="address"
          v-model="checkoutStore.address"
          required
          rows="4"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
          placeholder="Jalan, No. Rumah, RT/RW"
        />
      </div>

      <div>
        <Label for="notes" class="text-lg mb-2">
          Catatan (Opsional)
        </Label>

        <textarea
          id="notes"
          name="notes"
          v-model="checkoutStore.notes"
          rows="3"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
          placeholder="Catatan untuk pengiriman"
        />
      </div>
    </div>
  </Card>
</template>

<script setup>
import { MapPin } from 'lucide-vue-next'
import Card from '../ui/Card.vue'
import Label from '../ui/Label.vue'
import ProvinceSelect from '../ProvinceSelect.vue'
import CitySelect from '../CitySelect.vue'
import DistrictSelect from '../DistrictSelect.vue'

defineProps({
  checkoutStore: {
    type: Object,
    required: true,
  },
  shippingStore: {
    type: Object,
    required: true,
  },
  filterNumber: {
    type: Function,
    required: true,
  },
})
</script>
