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
          <button class="btn-base btn-secondary" :disabled="exporting" @click="exportCsv">
            {{ exporting ? 'Exporting...' : 'Export' }}
          </button>
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
              <td>
                <Badge size="sm" :color="orderStatusColor(order.status)">
                  {{ order.status }}
                </Badge>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <button class="btn-base btn-secondary" @click="viewDetail(order.id)">View</button>
                  <select
                    class="input-base !w-[140px]"
                    :disabled="isUpdating(order.id) || !getNextStatuses(order.status).length"
                    :value="order.status"
                    @change="onRowStatusChange(order, $event.target.value)"
                  >
                    <option :value="order.status">
                      {{ isUpdating(order.id) ? 'Updating…' : `Current: ${order.status}` }}
                    </option>
                    <option v-for="s in getNextStatuses(order.status)" :key="s" :value="s">
                      Move to: {{ s }}
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
          <h3 class="text-lg font-bold text-slate-900">Transaction Detail</h3>
          <Badge size="sm" :color="orderStatusColor(selected.status)">
            {{ selected.status }}
          </Badge>
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

        <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Quick Status Action</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="nextStatus in getNextStatuses(selected.status)"
              :key="`modal-action-${nextStatus}`"
              class="btn-base btn-secondary"
              :disabled="isUpdating(selected.id)"
              @click="updateStatus(selected.id, nextStatus)"
            >
              {{ isUpdating(selected.id) ? 'Updating…' : `Mark as ${nextStatus}` }}
            </button>
            <p v-if="!getNextStatuses(selected.status).length" class="text-sm text-slate-500">
              No further action for this status.
            </p>
          </div>
        </div>

        <div class="mt-5 rounded-xl border border-slate-200">
          <div class="table-wrap" v-if="selected.items?.length">
            <table class="table-base">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selected.items" :key="item.id">
                  <td>{{ item.product?.name || `Product #${item.productId || item.product_id}` }}</td>
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

const STATUS_TRANSITIONS = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

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

function isUpdating(id) {
  return !!updatingById.value[id]
}

function getNextStatuses(status) {
  return STATUS_TRANSITIONS[status] || []
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
    showToast(`Invalid transition: ${currentStatus} -> ${status}`, 'error')
    return
  }

  if (status === 'cancelled' || status === 'delivered') {
    const confirmed = window.confirm(`Confirm status change from ${currentStatus} to ${status}?`)
    if (!confirmed) return
  }

  updatingById.value = {
    ...updatingById.value,
    [id]: true,
  }

  const json = await patch(`/orders/${id}`, { status })
  if (!json.success) {
    showToast(json.message || `Failed to update status to ${status}`, 'error')
    updatingById.value = {
      ...updatingById.value,
      [id]: false,
    }
    return
  }

  const idx = orders.value.findIndex(o => o.id === id)
  if (idx !== -1) orders.value[idx].status = status
  if (selected.value?.id === id) selected.value.status = status
  showToast(`Order ${order?.orderNumber || `#${id}`} updated to ${status}`)

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
    ['Order ID', 'Customer', 'Phone', 'Email', 'Status', 'Date', 'Product', 'Unit', 'Qty', 'Unit Price', 'Line Total', 'Order Subtotal', 'Shipping', 'Order Total'],
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
          detail.customerEmail || '',
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
          detail.customerEmail || '',
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
    link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`
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
