<template>
  <div class="content">
    <div class="card">
      <div class="card-header">
        <span class="card-title">Pesanan</span>
        <div class="filter-bar">
          <select class="select-input" v-model="statusFilter">
            <option value="">Semua Status</option>
            <option v-for="s in ORDER_STATUSES" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
      </div>

      <div v-if="!loaded" class="loading">Loading orders…</div>
      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No orders found</p>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Order ID</th><th>Customer</th><th>City</th>
            <th>Total</th><th>Status</th><th>Date</th><th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td style="font-family:monospace;font-size:12px">{{ order.id.slice(0,8) }}…</td>
            <td>
              <div style="font-weight:500">{{ order.customer_name }}</div>
              <div style="font-size:12px;color:var(--mid)">{{ order.customer_phone }}</div>
            </td>
            <td>{{ order.customer_city }}</td>
            <td>Rp {{ Number(order.total).toLocaleString('id-ID') }}</td>
            <td>
              <select
                class="select-input"
                :value="order.status"
                @change="updateStatus(order.id, $event.target.value)"
                :class="`badge badge-${order.status}`"
                style="border:none;font-weight:500"
              >
                <option v-for="s in ORDER_STATUSES" :key="s" :value="s">{{ s }}</option>
              </select>
            </td>
            <td style="font-size:12px;color:var(--mid)">
              {{ new Date(order.created_at).toLocaleDateString('id-ID') }}
            </td>
            <td>
              <button class="btn btn-ghost btn-sm" @click="viewDetail(order.id)">Detail</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order detail modal -->
    <div class="modal-overlay" v-if="selected" @click.self="selected = null">
      <div class="modal-box">
        <div class="modal-title">Order detail</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
          <div><div class="detail-label">Customer</div><div class="detail-value">{{ selected.customer_name }}</div></div>
          <div><div class="detail-label">Phone</div><div class="detail-value">{{ selected.customer_phone }}</div></div>
          <div style="grid-column:1/-1">
            <div class="detail-label">Address</div>
            <div class="detail-value">{{ selected.customer_address }}, {{ selected.customer_city }} {{ selected.customer_postal }}</div>
          </div>
          <div v-if="selected.customer_notes" style="grid-column:1/-1">
            <div class="detail-label">Notes</div>
            <div class="detail-value">{{ selected.customer_notes }}</div>
          </div>
        </div>

        <table v-if="selected.items?.length">
          <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
          <tbody>
            <tr v-for="item in selected.items" :key="item.id">
              <td>{{ item.product_name }}</td>
              <td>{{ item.qty }}</td>
              <td>Rp {{ Number(item.price).toLocaleString('id-ID') }}</td>
              <td>Rp {{ Number(item.line_total).toLocaleString('id-ID') }}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between;font-weight:500">
          <span>Total</span>
          <span>Rp {{ Number(selected.total).toLocaleString('id-ID') }}</span>
        </div>

        <div class="modal-actions">
          <button class="btn btn-ghost" @click="selected = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useApi } from '../composables/useApi.js'

const { get, patch } = useApi()

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const orders       = ref([])
const loaded       = ref(false)
const statusFilter = ref('')
const selected     = ref(null)

async function loadOrders() {
  loaded.value = false
  const qs   = statusFilter.value ? `?status=${statusFilter.value}` : ''
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

watch(statusFilter, loadOrders)
onMounted(loadOrders)
</script>
