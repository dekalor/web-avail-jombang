<template>
  <div class="min-h-screen py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-4xl font-bold text-[#2C4A2F] mb-8">Checkout</h1>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-sm p-8">
            <div class="flex items-center gap-3 mb-8">
              <MapPin class="w-7 h-7 text-[#7BA87D]" />
              <h2 class="text-2xl font-bold text-gray-900">
                Informasi Pengiriman
              </h2>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input v-model="form.name" type="text" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BA87D] focus:border-transparent"
                  placeholder="Masukkan nama lengkap" />
              </div>

              <!-- Phone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon <span class="text-red-500">*</span>
                </label>
                <input v-model="form.phone" type="tel" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BA87D] focus:border-transparent"
                  placeholder="08xxxxxxxxxx" />
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap <span class="text-red-500">*</span>
                </label>
                <textarea v-model="form.address" required rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BA87D] focus:border-transparent"
                  placeholder="Jalan, RT/RW, Kelurahan"></textarea>
              </div>

              <!-- City & Postal Code -->
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kota <span class="text-red-500">*</span>
                  </label>
                  <input v-model="form.city" type="text" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BA87D] focus:border-transparent"
                    placeholder="Nama kota" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kode Pos <span class="text-red-500">*</span>
                  </label>
                  <input v-model="form.postal" type="text" required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BA87D] focus:border-transparent"
                    placeholder="12345" />
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea v-model="form.notes" rows="2"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BA87D] focus:border-transparent"
                  placeholder="Catatan untuk penjual"></textarea>
              </div>

              <!-- Submit Button -->
              <button type="submit" :disabled="loading"
                class="w-full bg-[#7BA87D] hover:bg-[#6A9570] disabled:bg-gray-400 text-white py-4 rounded-lg text-lg font-semibold transition-colors">
                {{ loading ? 'Memproses...' : 'Buat Pesanan' }}
              </button>
            </form>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ringkasan Pesanan
            </h2>

            <!-- Items -->
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              <div v-for="item in cart.items" :key="item.id" class="flex gap-3">
                <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img :src="item.imageUrl" :alt="item.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-base font-semibold text-gray-900">
                    {{ item.name }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {{ item.quantity }} x @ {{ formatPrice(item.price) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-3 mb-6 border-t pt-4">
              <div class="flex justify-between text-lg">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-semibold">
                  {{ formatPrice(subtotal) }}
                </span>
              </div>
              <div class="flex justify-between text-lg">
                <span class="text-gray-600">Ongkir</span>
                <span class="font-semibold text-green-600">GRATIS</span>
              </div>
              <div class="border-t pt-3">
                <div class="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span class="text-[#7BA87D]">
                    {{ formatPrice(subtotal) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useProducts } from '../composables/useProducts'
import { MapPin } from 'lucide-vue-next'

const router = useRouter()
const cart = useCartStore()
const { formatPrice } = useProducts()

const loading = ref(false)
const form = ref({
  name: '',
  phone: '',
  address: '',
  city: '',
  postal: '',
  notes: ''
})

const subtotal = computed(() => cart.totalPrice)

async function handleSubmit() {
  loading.value = true

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  // In production, call your backend API here:
  // const response = await fetch('/api/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     customer: form.value,
  //     cart: cart.items.map(i => ({ id: i.id, qty: i.quantity }))
  //   })
  // })

  alert('Pesanan berhasil dibuat! Terima kasih telah berbelanja.')
  cart.clearCart()
  router.push('/')

  loading.value = false
}
</script>
