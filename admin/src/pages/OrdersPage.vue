<template>
  <div class="space-y-4">
    <div
      v-if="toast.message"
      class="fixed right-4 top-4 z-[70] rounded-lg border px-3 py-2 text-sm font-medium shadow-theme-sm"
      :class="toast.type === 'error'
        ? 'border-error-200 bg-error-50 text-error-700'
        : 'border-success-200 bg-success-50 text-success-700'"
    >
      {{ toast.message }}
    </div>

    <section class="panel overflow-hidden">
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Transaksi</h2>
          <p class="text-sm text-slate-500">Kelola transaksi pelanggan dengan cepat dan aman.</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="option in dayOptions"
            :key="option.value"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
            :class="selectedDays === option.value
              ? 'border-blue-200 bg-blue-50 text-blue-700'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'"
            @click="selectedDays = option.value"
          >
            {{ option.label }}
          </button>
          <button class="btn-base btn-secondary" :disabled="exporting" @click="exportCsv">
            {{ exporting ? 'Mengekspor...' : 'Ekspor' }}
          </button>
        </div>
      </header>

      <div class="border-b border-slate-200 px-4 py-3">
        <div class="grid gap-3 md:grid-cols-6">
          <input class="input-base" v-model="searchQuery" placeholder="Cari nomor pesanan atau nama pelanggan" />
          <select class="input-base" v-model="statusFilter" @change="applyServerFilters">
            <option value="">Semua Status</option>
            <option v-for="s in ORDER_STATUSES" :key="s" :value="s">{{ statusLabel(s) }}</option>
          </select>
          <select class="input-base" v-model="sortBy" @change="applyServerFilters">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              Urutkan: {{ option.label }}
            </option>
          </select>
          <select class="input-base" v-model="sortDir" @change="applyServerFilters">
            <option value="desc">Terbaru / Tertinggi</option>
            <option value="asc">Terlama / Terendah</option>
          </select>
          <select class="input-base" v-model.number="pageSize" @change="applyServerFilters">
            <option :value="10">10 / halaman</option>
            <option :value="20">20 / halaman</option>
            <option :value="50">50 / halaman</option>
          </select>
          <button class="btn-base btn-primary" @click="loadOrders">Muat Ulang</button>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
        <p class="text-xs text-slate-600">
          Menampilkan
          <span class="font-semibold text-slate-800">{{ pageRangeStart }}-{{ pageRangeEnd }}</span>
          dari
          <span class="font-semibold text-slate-800">{{ totalItems }}</span> transaksi
          <span v-if="hiddenByFiltersCount > 0">
            (<span class="font-semibold text-amber-700">{{ hiddenByFiltersCount }}</span> tersembunyi karena filter)
          </span>
        </p>
        <div class="flex items-center gap-2">
          <button
            class="btn-base btn-secondary !px-2.5 !py-1 text-xs"
            :disabled="page <= 1 || !loaded"
            @click="goToPage(page - 1)"
          >
            Sebelumnya
          </button>
          <span class="text-xs text-slate-600">Halaman {{ page }} / {{ totalPages }}</span>
          <button
            class="btn-base btn-secondary !px-2.5 !py-1 text-xs"
            :disabled="page >= totalPages || !loaded"
            @click="goToPage(page + 1)"
          >
            Berikutnya
          </button>
          <button
            v-if="hasActiveFilters"
            class="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            @click="resetFilters"
          >
            Reset Filter
          </button>
        </div>
      </div>

      <div v-if="!loaded" class="px-4 py-6 text-sm text-slate-600">Memuat transaksi…</div>
      <div v-else-if="filteredOrders.length === 0" class="px-4 py-10 text-center text-sm text-slate-500">Tidak ada transaksi</div>

      <div v-else class="table-wrap">
        <table class="table-base">
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Pelanggan</th>
              <th>Total Belanja</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="font-mono text-xs">{{ order.orderNumber || `#${order.id}` }}</td>
              <td>
                <p class="font-semibold text-slate-800">{{ order.customerName }}</p>
                <p class="text-xs text-slate-500">{{ order.customerPhone || '-' }}</p>
              </td>
              <td class="font-semibold text-slate-800">{{ formatCurrency(order.total) }}</td>
              <td class="text-slate-600">{{ formatDate(order.dueDate || getOrderCreatedAt(order)) }}</td>
              <td>
                <Badge size="sm" :color="orderStatusColor(order.status)">
                  {{ statusLabel(order.status) }}
                </Badge>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <button class="btn-base btn-secondary" @click="viewDetail(order.id)">Detail</button>
                  <select
                    class="input-base !w-[140px]"
                    :disabled="isUpdating(order.id) || !getNextStatuses(order.status).length"
                    :value="order.status"
                    @change="onRowStatusChange(order, $event.target.value)"
                  >
                    <option :value="order.status">
                      {{ isUpdating(order.id) ? 'Memperbarui…' : `Saat ini: ${statusLabel(order.status)}` }}
                    </option>
                    <option v-for="s in getNextStatuses(order.status)" :key="s" :value="s">
                      Ubah ke: {{ statusLabel(s) }}
                    </option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="modal-overlay" v-if="selected" @click.self="selected = null">
      <div class="modal-box">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-bold text-slate-900">Detail Transaksi</h3>
          <Badge size="sm" :color="orderStatusColor(selected.status)">
            {{ statusLabel(selected.status) }}
          </Badge>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <p class="label-base">Nomor Pesanan</p>
            <p class="text-sm font-semibold text-slate-800">{{ selected.orderNumber || `#${selected.id}` }}</p>
          </div>
          <div>
            <p class="label-base">Pelanggan</p>
            <p class="text-sm font-semibold text-slate-800">{{ selected.customerName }}</p>
          </div>
          <div>
            <p class="label-base">No. Telepon</p>
            <p class="text-sm text-slate-700">{{ selected.customerPhone }}</p>
          </div>
          <div>
            <p class="label-base">ID Metode Pembayaran</p>
            <p class="text-sm text-slate-700">{{ selected.paymentMethodId }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="label-base">Alamat</p>
            <p class="text-sm text-slate-700">
              {{ selected.address }} (Prov: {{ selected.provinceId }}, Kota: {{ selected.cityId }}, Kec: {{ selected.districtId }}) {{ selected.postalCode }}
            </p>
          </div>
          <div class="sm:col-span-2" v-if="selected.notes">
            <p class="label-base">Catatan</p>
            <p class="text-sm text-slate-700">{{ selected.notes }}</p>
          </div>
          <div class="sm:col-span-2" v-if="selected.paymentProofUrl">
            <p class="label-base">Bukti Pembayaran</p>
            <div class="rounded-xl border border-slate-200 bg-white p-3">
              <div v-if="isImageProof(selected.paymentProofUrl)" class="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  class="group relative h-28 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:w-40"
                  @click="openProofPreview(selected.paymentProofUrl)"
                >
                  <img
                    :src="selected.paymentProofUrl"
                    alt="Payment proof"
                    class="h-full w-full object-cover transition group-hover:scale-[1.02]"
                    @error="onProofThumbError"
                  />
                  <div class="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1 text-xs font-medium text-white">
                    Klik untuk pratinjau
                  </div>
                </button>
                <div class="min-w-0 space-y-2">
                  <p class="truncate text-xs text-slate-500">{{ selected.paymentProofUrl }}</p>
                  <div class="flex flex-wrap gap-2">
                    <a
                      :href="selected.paymentProofUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn-base btn-secondary !px-2.5 !py-1 text-xs"
                    >
                      Buka
                    </a>
                    <a
                      :href="selected.paymentProofUrl"
                      download
                      class="btn-base btn-secondary !px-2.5 !py-1 text-xs"
                    >
                      Unduh
                    </a>
                  </div>
                </div>
              </div>

              <div v-else class="space-y-2">
                <p class="truncate text-sm font-medium text-slate-700">{{ proofFileName(selected.paymentProofUrl) }}</p>
                <p class="truncate text-xs text-slate-500">{{ selected.paymentProofUrl }}</p>
                <div class="flex flex-wrap gap-2">
                  <a
                    :href="selected.paymentProofUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-base btn-secondary !px-2.5 !py-1 text-xs"
                  >
                    Buka
                  </a>
                  <a
                    :href="selected.paymentProofUrl"
                    download
                    class="btn-base btn-secondary !px-2.5 !py-1 text-xs"
                  >
                    Unduh
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="sm:col-span-2" v-else>
            <p class="label-base">Bukti Pembayaran</p>
            <p class="text-sm text-slate-500">Tidak ada bukti pembayaran.</p>
          </div>
        </div>

        <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Aksi Cepat Status</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="nextStatus in getNextStatuses(selected.status)"
              :key="`modal-action-${nextStatus}`"
              class="btn-base btn-secondary"
              :disabled="isUpdating(selected.id)"
              @click="updateStatus(selected.id, nextStatus)"
            >
              {{ isUpdating(selected.id) ? 'Memperbarui…' : `Tandai ${statusLabel(nextStatus)}` }}
            </button>
            <p v-if="!getNextStatuses(selected.status).length" class="text-sm text-slate-500">
              Tidak ada aksi lanjutan untuk status ini.
            </p>
          </div>
        </div>

        <div class="mt-5 rounded-xl border border-slate-200">
          <div class="table-wrap" v-if="selected.items?.length">
            <table class="table-base">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th>Satuan</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selected.items" :key="item.id">
                  <td>{{ item.product?.name || `Produk #${item.productId || item.product_id}` }}</td>
                  <td>
                    {{ formatOrderItemUnit(item) }}
                  </td>
                  <td>{{ item.qty }} {{ formatOrderItemUnitCode(item) }}</td>
                  <td>{{ formatCurrency(item.price) }}</td>
                  <td>{{ formatCurrency(Number(item.qty) * Number(item.price)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="px-4 py-6 text-center text-sm text-slate-500">Tidak ada item pesanan</div>
        </div>

        <div class="mt-5 space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Subtotal</span>
            <span class="font-semibold text-slate-800">{{ formatCurrency(selected.subtotal) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Ongkir</span>
            <span class="font-semibold text-slate-800">{{ formatCurrency(selected.shippingCost) }}</span>
          </div>
          <div class="flex items-center justify-between border-t border-slate-200 pt-2">
            <span class="font-semibold text-slate-700">Total</span>
            <span class="text-base font-bold text-slate-900">{{ formatCurrency(selected.total) }}</span>
          </div>
        </div>

        <div class="mt-5 flex justify-end">
          <button class="btn-base btn-secondary" @click="selected = null">Tutup</button>
        </div>
      </div>
    </div>

    <div class="modal-overlay" v-if="proofPreviewUrl" @click.self="proofPreviewUrl = ''">
      <div class="modal-box !max-w-4xl">
        <div class="mb-3 flex items-center justify-between">
          <h4 class="text-base font-semibold text-slate-900">Pratinjau Bukti Pembayaran</h4>
          <button class="btn-base btn-secondary !px-2.5 !py-1 text-xs" @click="proofPreviewUrl = ''">Tutup</button>
        </div>
        <div class="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          <img
            :src="proofPreviewUrl"
            alt="Payment proof preview"
            class="max-h-[75vh] w-full object-contain"
            @error="onProofPreviewError"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../composables/useApi.js'
import Badge from '../components/ui/Badge.vue'

const { get, patch } = useApi()

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const orders = ref([])
const loaded = ref(false)
const statusFilter = ref('')
const selected = ref(null)
const searchQuery = ref('')
const selectedDays = ref(0)
const exporting = ref(false)
const updatingById = ref({})
const toast = ref({ message: '', type: 'success' })
const proofPreviewUrl = ref('')
const page = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const sortBy = ref('createdAt')
const sortDir = ref('desc')

const sortOptions = [
  { label: 'Tanggal Dibuat', value: 'createdAt' },
  { label: 'Nomor Pesanan', value: 'orderNumber' },
  { label: 'Nama Pelanggan', value: 'customerName' },
  { label: 'Total Belanja', value: 'total' },
  { label: 'Status', value: 'status' },
]

const STATUS_TRANSITIONS = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

const dayOptions = [
  { label: 'Semua Waktu', value: 0 },
  { label: '7 Hari', value: 7 },
  { label: '30 Hari', value: 30 },
  { label: '90 Hari', value: 90 },
]

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const now = Date.now()

  return orders.value.filter(order => {
    if (selectedDays.value > 0) {
      const createdValue = order.createdAt || order.created_at
      const createdTime = new Date(createdValue).getTime()
      // If date is missing/invalid, don't hide the transaction.
      if (!Number.isFinite(createdTime)) return true
      const diffDays = (now - createdTime) / (1000 * 60 * 60 * 24)
      if (diffDays > selectedDays.value) return false
    }

    if (!query) return true

    const orderNumber = String(order.orderNumber || order.id || '').toLowerCase()
    const customerName = String(order.customerName || '').toLowerCase()
    return orderNumber.includes(query) || customerName.includes(query)
  })
})

const hiddenByFiltersCount = computed(() => Math.max(orders.value.length - filteredOrders.value.length, 0))
const totalPages = computed(() => Math.max(Math.ceil(totalItems.value / pageSize.value), 1))
const pageRangeStart = computed(() => {
  if (totalItems.value === 0) return 0
  return (page.value - 1) * pageSize.value + 1
})
const pageRangeEnd = computed(() => {
  if (totalItems.value === 0) return 0
  return Math.min(page.value * pageSize.value, totalItems.value)
})

const hasActiveFilters = computed(() => (
  !!statusFilter.value ||
  !!searchQuery.value.trim() ||
  selectedDays.value > 0 ||
  sortBy.value !== 'createdAt' ||
  sortDir.value !== 'desc' ||
  pageSize.value !== 10
))

async function loadOrders() {
  loaded.value = false
  const params = new URLSearchParams()
  params.set('page', String(page.value))
  params.set('page_size', String(pageSize.value))
  params.set('sort_by', sortBy.value)
  params.set('sort_dir', sortDir.value)
  if (statusFilter.value) params.set('status', statusFilter.value)

  const json = await get(`/orders?${params.toString()}`)
  if (json.success) {
    orders.value = Array.isArray(json.data) ? json.data : []
    totalItems.value = Number(json.meta?.total ?? orders.value.length)
    const serverPage = Number(json.meta?.page || page.value)
    const serverTotalPages = Number(json.meta?.totalPages || totalPages.value)
    page.value = Math.min(Math.max(serverPage, 1), Math.max(serverTotalPages, 1))
  }
  loaded.value = true
}

function applyServerFilters() {
  page.value = 1
  loadOrders()
}

function goToPage(nextPage) {
  if (nextPage < 1 || nextPage > totalPages.value || nextPage === page.value) return
  page.value = nextPage
  loadOrders()
}

function isUpdating(id) {
  return !!updatingById.value[id]
}

function getNextStatuses(status) {
  return STATUS_TRANSITIONS[status] || []
}

function statusLabel(status) {
  switch (status) {
    case 'pending':
      return 'belum diproses'
    case 'processing':
      return 'diproses'
    case 'shipped':
      return 'dikirim'
    case 'delivered':
      return 'terkirim'
    case 'cancelled':
      return 'dibatalkan'
    default:
      return status || '-'
  }
}

function isImageProof(url) {
  if (!url) return false
  return /\.(png|jpe?g|webp|gif|bmp|svg)(\?.*)?$/i.test(url)
}

function proofFileName(url) {
  if (!url) return '-'
  const path = String(url).split('?')[0]
  const chunks = path.split('/')
  return chunks[chunks.length - 1] || 'payment-proof'
}

function openProofPreview(url) {
  if (!isImageProof(url)) return
  proofPreviewUrl.value = url
}

function onProofThumbError(event) {
  event?.target?.setAttribute('alt', 'Cannot load payment proof')
}

function onProofPreviewError() {
  showToast('Gagal memuat pratinjau bukti pembayaran', 'error')
  proofPreviewUrl.value = ''
}

function showToast(message, type = 'success') {
  toast.value = { message, type }
  window.setTimeout(() => {
    if (toast.value.message === message) {
      toast.value = { message: '', type: 'success' }
    }
  }, 2500)
}

async function onRowStatusChange(order, nextStatus) {
  if (!nextStatus || nextStatus === order.status) return
  await updateStatus(order.id, nextStatus)
}

async function updateStatus(id, status) {
  const order = orders.value.find(o => o.id === id)
  const currentStatus = order?.status || selected.value?.status
  if (!currentStatus || currentStatus === status) return

  if (!getNextStatuses(currentStatus).includes(status)) {
    showToast(`Perubahan status tidak valid: ${statusLabel(currentStatus)} -> ${statusLabel(status)}`, 'error')
    return
  }

  if (status === 'cancelled' || status === 'delivered') {
    const confirmed = window.confirm(`Konfirmasi perubahan status dari ${statusLabel(currentStatus)} ke ${statusLabel(status)}?`)
    if (!confirmed) return
  }

  updatingById.value = {
    ...updatingById.value,
    [id]: true,
  }

  const json = await patch(`/orders/${id}`, { status })
  if (!json.success) {
    showToast(json.message || `Gagal memperbarui status menjadi ${statusLabel(status)}`, 'error')
    updatingById.value = {
      ...updatingById.value,
      [id]: false,
    }
    return
  }

  const idx = orders.value.findIndex(o => o.id === id)
  if (idx !== -1) orders.value[idx].status = status
  if (selected.value?.id === id) selected.value.status = status
  showToast(`Pesanan ${order?.orderNumber || `#${id}`} berhasil diubah ke ${statusLabel(status)}`)

  updatingById.value = {
    ...updatingById.value,
    [id]: false,
  }
}

async function viewDetail(id) {
  const json = await get(`/orders/${id}`)
  if (json.success) selected.value = json.data
}

async function exportCsv() {
  exporting.value = true
  const rows = [
    ['ID Pesanan', 'Pelanggan', 'Telepon', 'Status', 'Tanggal', 'Produk', 'Satuan', 'Qty', 'Harga Satuan', 'Total Item', 'Subtotal Pesanan', 'Ongkir', 'Total Pesanan'],
  ]

  try {
    const detailResponses = await Promise.all(
      filteredOrders.value.map(order => get(`/orders/${order.id}`))
    )

    filteredOrders.value.forEach((order, idx) => {
      const detail = detailResponses[idx]?.success ? detailResponses[idx].data : order
      const items = Array.isArray(detail.items) ? detail.items : []

      if (!items.length) {
        rows.push([
          detail.orderNumber || `#${detail.id}`,
          detail.customerName || '',
          detail.customerPhone || '',
          detail.status || '',
          formatDate(getOrderCreatedAt(detail)),
          '',
          '',
          '',
          '',
          '',
          Number(detail.subtotal || 0),
          Number(detail.shippingCost || 0),
          Number(detail.total || 0),
        ])
        return
      }

      items.forEach(item => {
        const qty = Number(item.qty || 0)
        const price = Number(item.price || 0)
        rows.push([
          detail.orderNumber || `#${detail.id}`,
          detail.customerName || '',
          detail.customerPhone || '',
          detail.status || '',
          formatDate(getOrderCreatedAt(detail)),
          item.product?.name || `Product #${item.productId || item.product_id || ''}`,
          formatOrderItemUnit(item),
          qty,
          price,
          qty * price,
          Number(detail.subtotal || 0),
          Number(detail.shippingCost || 0),
          Number(detail.total || 0),
        ])
      })
    })

    const csv = rows.map(r => r.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transaksi-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  } finally {
    exporting.value = false
  }
}

function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  selectedDays.value = 0
  sortBy.value = 'createdAt'
  sortDir.value = 'desc'
  pageSize.value = 10
  page.value = 1
  loadOrders()
}

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID')
}

function getOrderCreatedAt(order) {
  return order?.createdAt || order?.created_at || null
}

function formatOrderItemUnit(item) {
  const unit = item?.unit
  if (!unit) return '-'
  return unit.label || String(unit.unitCode || '').toUpperCase() || '-'
}

function formatOrderItemUnitCode(item) {
  const code = item?.unit?.unitCode
  if (!code) return ''
  return String(code).toUpperCase()
}

function orderStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'processing':
      return 'info'
    case 'shipped':
      return 'primary'
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'error'
    default:
      return 'light'
  }
}

onMounted(loadOrders)
</script>
