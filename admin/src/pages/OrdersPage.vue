<template>
  <div class="space-y-4">
    <section class="panel overflow-hidden">
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Transactions</h2>
          <p class="text-sm text-slate-500">Follow the transaction table pattern from TailAdmin.</p>
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
          <button class="btn-base btn-secondary" @click="exportCsv">Export</button>
        </div>
      </header>

      <div class="border-b border-slate-200 px-4 py-3">
        <div class="grid gap-3 md:grid-cols-3">
          <input class="input-base" v-model="searchQuery" placeholder="Search by order number or customer" />
          <select class="input-base" v-model="statusFilter">
            <option value="">All Status</option>
            <option v-for="s in ORDER_STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
          <button class="btn-base btn-primary" @click="loadOrders">Refresh Data</button>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
        <p class="text-xs text-slate-600">
          Showing <span class="font-semibold text-slate-800">{{ filteredOrders.length }}</span> of
          <span class="font-semibold text-slate-800">{{ orders.length }}</span> transactions
          <span v-if="hiddenByFiltersCount > 0">
            (<span class="font-semibold text-amber-700">{{ hiddenByFiltersCount }}</span> hidden by filters)
          </span>
        </p>
        <button
          v-if="hasActiveFilters"
          class="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          @click="resetFilters"
        >
          Reset filters
        </button>
      </div>

      <div v-if="!loaded" class="px-4 py-6 text-sm text-slate-600">Loading transactions…</div>
      <div v-else-if="filteredOrders.length === 0" class="px-4 py-10 text-center text-sm text-slate-500">No transactions found</div>

      <div v-else class="table-wrap">
        <table class="table-base">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Total Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="font-mono text-xs">{{ order.orderNumber || `#${order.id}` }}</td>
              <td>
                <p class="font-semibold text-slate-800">{{ order.customerName }}</p>
                <p class="text-xs text-slate-500">{{ order.customerPhone || '-' }}</p>
              </td>
              <td class="text-slate-600">{{ order.customerEmail || '-' }}</td>
              <td class="font-semibold text-slate-800">{{ formatCurrency(order.total) }}</td>
              <td class="text-slate-600">{{ formatDate(order.dueDate || getOrderCreatedAt(order)) }}</td>
              <td><span class="badge" :class="statusClass(order.status)">{{ order.status }}</span></td>
              <td>
                <div class="flex items-center gap-2">
                  <button class="btn-base btn-secondary" @click="viewDetail(order.id)">View</button>
                  <select
                    class="input-base !w-[140px]"
                    :value="order.status"
                    @change="updateStatus(order.id, $event.target.value)"
                  >
                    <option v-for="s in ORDER_STATUSES" :key="s" :value="s">{{ s }}</option>
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
          <h3 class="text-lg font-bold text-slate-900">Transaction Detail</h3>
          <span class="badge" :class="statusClass(selected.status)">{{ selected.status }}</span>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <p class="label-base">Order Number</p>
            <p class="text-sm font-semibold text-slate-800">{{ selected.orderNumber || `#${selected.id}` }}</p>
          </div>
          <div>
            <p class="label-base">Customer</p>
            <p class="text-sm font-semibold text-slate-800">{{ selected.customerName }}</p>
          </div>
          <div>
            <p class="label-base">Phone</p>
            <p class="text-sm text-slate-700">{{ selected.customerPhone }}</p>
          </div>
          <div>
            <p class="label-base">Payment Method ID</p>
            <p class="text-sm text-slate-700">{{ selected.paymentMethodId }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="label-base">Address</p>
            <p class="text-sm text-slate-700">
              {{ selected.address }} (Prov: {{ selected.provinceId }}, Kota: {{ selected.cityId }}, Kec: {{ selected.districtId }}) {{ selected.postalCode }}
            </p>
          </div>
          <div class="sm:col-span-2" v-if="selected.notes">
            <p class="label-base">Notes</p>
            <p class="text-sm text-slate-700">{{ selected.notes }}</p>
          </div>
          <div class="sm:col-span-2" v-if="selected.paymentProofUrl">
            <p class="label-base">Payment Proof</p>
            <a :href="selected.paymentProofUrl" target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-blue-600 hover:text-blue-700">
              {{ selected.paymentProofUrl }}
            </a>
          </div>
        </div>

        <div class="mt-5 rounded-xl border border-slate-200">
          <div class="table-wrap" v-if="selected.items?.length">
            <table class="table-base">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selected.items" :key="item.id">
                  <td>{{ item.product?.name || `Product #${item.productId}` }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ formatCurrency(item.price) }}</td>
                  <td>{{ formatCurrency(Number(item.qty) * Number(item.price)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="px-4 py-6 text-center text-sm text-slate-500">No line items</div>
        </div>

        <div class="mt-5 space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Subtotal</span>
            <span class="font-semibold text-slate-800">{{ formatCurrency(selected.subtotal) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Shipping</span>
            <span class="font-semibold text-slate-800">{{ formatCurrency(selected.shippingCost) }}</span>
          </div>
          <div class="flex items-center justify-between border-t border-slate-200 pt-2">
            <span class="font-semibold text-slate-700">Total</span>
            <span class="text-base font-bold text-slate-900">{{ formatCurrency(selected.total) }}</span>
          </div>
        </div>

        <div class="mt-5 flex justify-end">
          <button class="btn-base btn-secondary" @click="selected = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../composables/useApi.js'

const { get, patch } = useApi()

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const orders = ref([])
const loaded = ref(false)
const statusFilter = ref('')
const selected = ref(null)
const searchQuery = ref('')
const selectedDays = ref(0)

const dayOptions = [
  { label: 'All Time', value: 0 },
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
]

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const now = Date.now()

  return orders.value.filter(order => {
    if (statusFilter.value && order.status !== statusFilter.value) return false

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

const hasActiveFilters = computed(() => (
  !!statusFilter.value ||
  !!searchQuery.value.trim() ||
  selectedDays.value > 0
))

async function loadOrders() {
  loaded.value = false
  const qs = statusFilter.value ? `?status=${statusFilter.value}` : ''
  const json = await get(`/orders${qs}`)
  if (json.success) orders.value = json.data
  loaded.value = true
}

async function updateStatus(id, status) {
  const json = await patch(`/orders/${id}`, { status })
  if (json.success) {
    const idx = orders.value.findIndex(o => o.id === id)
    if (idx !== -1) orders.value[idx].status = status
    if (selected.value?.id === id) selected.value.status = status
  }
}

async function viewDetail(id) {
  const json = await get(`/orders/${id}`)
  if (json.success) selected.value = json.data
}

function exportCsv() {
  const rows = [
    ['Order ID', 'Customer', 'Phone', 'Email', 'Total', 'Status', 'Date'],
    ...filteredOrders.value.map(order => [
      order.orderNumber || `#${order.id}`,
      order.customerName || '',
      order.customerPhone || '',
      order.customerEmail || '',
      Number(order.total || 0),
      order.status || '',
      formatDate(getOrderCreatedAt(order)),
    ]),
  ]

  const csv = rows.map(r => r.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  selectedDays.value = 0
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

function statusClass(status) {
  return `badge-${status || 'pending'}`
}

onMounted(loadOrders)
</script>
