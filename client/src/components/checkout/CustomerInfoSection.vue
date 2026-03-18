<template>
  <Card>
    <div class="flex items-center gap-3 mb-6">
      <User class="w-6 h-6 sm:w-7 sm:h-7 text-[#7BA87D]" />
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
        Informasi Pribadi
      </h2>
    </div>

    <div class="space-y-5">
      <div>
        <Label for="name" class="text-lg mb-2">
          Nama Lengkap *
        </Label>

        <input
          id="name"
          name="name"
          v-model="checkoutStore.name"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
          placeholder="Masukkan nama lengkap"
        />
      </div>

      <div>
        <Label for="phone" class="text-lg mb-2">
          Nomor Whatsapp *
        </Label>

        <input
          id="phone"
          name="phone"
          type="tel"
          v-model="checkoutStore.phone"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BA87D]"
          placeholder="08xxxxxxxxxx"
        />
      </div>
    </div>
  </Card>
</template>

<script setup>
import { User } from 'lucide-vue-next'
import Card from '../ui/Card.vue'
import Label from '../ui/Label.vue'

defineProps({
  checkoutStore: {
    type: Object,
    required: true,
  },
})
</script>
