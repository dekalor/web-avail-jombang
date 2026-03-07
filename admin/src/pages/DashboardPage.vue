<template>
  <div v-if="!loaded" class="panel p-6 text-sm font-medium text-slate-600">Memuat dashboard…</div>

  <div v-else class="space-y-6">
    <section>
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p class="text-sm text-slate-500">Ringkasan performa toko, pesanan, dan pendapatan.</p>
        </div>
        <button class="btn-base btn-secondary" @click="loadDashboard">Muat Ulang</button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article class="stat-card relative overflow-hidden">
          <span class="absolute inset-x-0 top-0 h-1 bg-brand-500"></span>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pelanggan</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ stats.unique_customers || 0 }}</p>
          <p class="mt-1 text-xs text-slate-500">Pelanggan unik dari seluruh pesanan</p>
        </article>

        <article class="stat-card relative overflow-hidden">
          <span class="absolute inset-x-0 top-0 h-1 bg-amber-500"></span>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pesanan</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ stats.total_orders }}</p>
          <p class="mt-1 text-xs text-amber-600">{{ stats.pending }} belum diproses</p>
        </article>

        <article class="stat-card relative overflow-hidden">
          <span class="absolute inset-x-0 top-0 h-1 bg-emerald-500"></span>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pendapatan</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">Rp {{ Number(stats.total_revenue).toLocaleString('id-ID') }}</p>
          <p class="mt-1 text-xs text-slate-500">Hanya pesanan yang sudah diproses</p>
        </article>

        <article class="stat-card relative overflow-hidden">
          <span class="absolute inset-x-0 top-0 h-1 bg-rose-500"></span>
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Produk Aktif</p>
          <p class="mt-3 text-3xl font-bold text-emerald-600">{{ stats.total }}</p>
          <p class="mt-1 text-xs text-rose-600">{{ stats.low_stock }} stok menipis</p>
        </article>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-3">
      <article class="panel overflow-hidden xl:col-span-2">
        <div class="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 class="text-sm font-bold text-slate-800">Penjualan Harian</h3>
            <p class="mt-1 text-xs text-slate-500">7 hari terakhir</p>
          </div>
          <div class="text-left sm:text-right">
            <p class="text-xs text-slate-500">Total 7 hari</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ formatCurrency(sevenDayRevenue) }}</p>
          </div>
        </div>

        <div class="px-2 sm:px-4 py-3">
          <BarChartOne
            :categories="dailySalesChart.categories"
            :series-data="dailySalesChart.data"
            series-name="Pendapatan Harian"
          />
        </div>

        <div class="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">
          <span>Rata-rata per hari:</span>
          <span class="ml-1.5 font-semibold text-slate-700">{{ formatCurrency(avgDailyRevenue) }}</span>
        </div>
      </article>

      <article class="panel p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-800">Status Pesanan Hari Ini</h3>
          <span class="text-xs font-semibold text-slate-500">{{ stats.today || 0 }} total</span>
        </div>

        <p class="mt-1 text-xs text-slate-500">Distribusi status pesanan yang dibuat hari ini.</p>

        <div class="mt-4 space-y-2.5 text-sm">
          <div
            v-for="statusRow in todayStatusCards"
            :key="statusRow.key"
            class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
          >
            <div class="mb-1.5 flex items-center justify-between">
              <span class="inline-flex items-center gap-2">
                <span class="h-2.5 w-2.5 rounded-full" :class="statusRow.dotClass"></span>
                <span class="text-slate-700">{{ statusRow.label }}</span>
              </span>
              <span class="font-semibold text-slate-900">{{ statusRow.count }}</span>
            </div>
            <div class="h-1.5 w-full overflow-hidden rounded bg-slate-200">
              <div
                class="h-full rounded"
                :class="statusRow.dotClass"
                :style="{ width: `${statusRow.ratio}%` }"
              ></div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section class="grid gap-6 xl:grid-cols-2">
      <article class="panel overflow-hidden">
        <div class="border-b border-slate-200 px-4 py-3">
          <h3 class="text-sm font-bold text-slate-800">Produk Terlaris</h3>
        </div>

        <div v-if="stats.topProducts?.length" class="divide-y divide-slate-200">
          <div
            v-for="(p, i) in stats.topProducts"
            :key="p.product_name"
            class="flex items-center gap-3 px-4 py-3"
          >
            <span class="w-5 text-sm font-bold text-slate-500">{{ i + 1 }}</span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-slate-800">{{ p.product_name }}</p>
              <div class="mt-1 h-2 overflow-hidden rounded bg-slate-100">
                <div class="h-full rounded bg-emerald-500" :style="{ width: `${(p.units_sold / topMax) * 100}%` }"></div>
              </div>
            </div>
            <p class="text-xs font-semibold text-slate-500">{{ p.units_sold }} unit</p>
          </div>
        </div>

        <div v-else class="px-4 py-10 text-center text-sm text-slate-500">Belum ada penjualan</div>
      </article>

      <article class="panel overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 class="text-sm font-bold text-slate-800">Pesanan Terbaru</h3>
          <span class="text-xs text-slate-500">5 terbaru</span>
        </div>

        <div v-if="recentOrders.length" class="table-wrap">
          <table class="table-base">
            <thead>
              <tr>
                <th>Pesanan</th>
                <th>Pelanggan</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id">
                <td class="font-mono text-xs">{{ order.orderNumber || `#${order.id}` }}</td>
                <td>
                  <p class="font-semibold text-slate-800">{{ order.customerName }}</p>
                  <p class="text-xs text-slate-500">{{ formatDate(order.createdAt) }}</p>
                </td>
                <td>{{ formatCurrency(order.total) }}</td>
                <td><span class="badge" :class="statusClass(order.status)">{{ statusLabel(order.status) }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="px-4 py-10 text-center text-sm text-slate-500">Belum ada pesanan terbaru</div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useApi } from '../composables/useApi.js'
import BarChartOne from '../components/charts/BarChartOne.vue'

const { get } = useApi()

const stats = ref(null)
const loaded = ref(false)
const recentOrders = ref([])

async function loadDashboard() {
  loaded.value = false

  const [dashboardJson, ordersJson] = await Promise.all([
    get('/dashboard').catch(() => null),
    get('/orders').catch(() => null),
  ])

  if (dashboardJson?.success) stats.value = dashboardJson.data
  if (ordersJson?.success) recentOrders.value = (ordersJson.data || []).slice(0, 5)

  loaded.value = true
}

const topMax = computed(() => {
  if (!stats.value?.topProducts?.length) return 1
  return Math.max(...stats.value.topProducts.map(p => p.units_sold), 1)
})

const sevenDayRevenue = computed(() =>
  dailySalesChart.value.data.reduce((sum, value) => sum + Number(value || 0), 0)
)

const avgDailyRevenue = computed(() =>
  Math.round(sevenDayRevenue.value / Math.max(dailySalesChart.value.data.length, 1))
)

const dailySalesChart = computed(() => {
  const rows = Array.isArray(stats.value?.revenue7d) ? stats.value.revenue7d : []
  const revenueMap = new Map(
    rows.map(row => [String(row.day), Number(row.revenue || 0)])
  )

  const categories = []
  const data = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - i)

    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const key = `${y}-${m}-${d}`

    categories.push(date.toLocaleDateString('id-ID', { weekday: 'short' }))
    data.push(Number(revenueMap.get(key) || 0))
  }

  return { categories, data }
})

const todayStatusCards = computed(() => {
  const counts = stats.value?.today_status_counts || {}
  const maxCount = Math.max(
    Number(counts.pending || 0),
    Number(counts.processing || 0),
    Number(counts.shipped || 0),
    Number(counts.delivered || 0),
    Number(counts.cancelled || 0),
    1
  )
  return [
    { key: 'pending', label: 'Belum Diproses', count: Number(counts.pending || 0), dotClass: 'bg-amber-500', ratio: Math.round((Number(counts.pending || 0) / maxCount) * 100) },
    { key: 'processing', label: 'Diproses', count: Number(counts.processing || 0), dotClass: 'bg-blue-500', ratio: Math.round((Number(counts.processing || 0) / maxCount) * 100) },
    { key: 'shipped', label: 'Dikirim', count: Number(counts.shipped || 0), dotClass: 'bg-sky-500', ratio: Math.round((Number(counts.shipped || 0) / maxCount) * 100) },
    { key: 'delivered', label: 'Terkirim', count: Number(counts.delivered || 0), dotClass: 'bg-emerald-500', ratio: Math.round((Number(counts.delivered || 0) / maxCount) * 100) },
    { key: 'cancelled', label: 'Dibatalkan', count: Number(counts.cancelled || 0), dotClass: 'bg-rose-500', ratio: Math.round((Number(counts.cancelled || 0) / maxCount) * 100) },
  ]
})

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('id-ID')
}

function formatCurrency(value) {
  return `Rp ${Number(value || 0).toLocaleString('id-ID')}`
}

function statusClass(status) {
  return `badge-${status || 'pending'}`
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

onMounted(loadDashboard)
</script>
