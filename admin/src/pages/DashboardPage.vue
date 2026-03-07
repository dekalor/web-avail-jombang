<template>
  <div v-if="!loaded" class="panel p-6 text-sm font-medium text-slate-600">Memuat dashboard…</div>

  <div v-else class="space-y-6">
    <section>
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Dashboard</h2>
          <p class="text-sm text-slate-500">Ringkasan performa toko, pesanan, dan pendapatan.</p>
        </div>
        <button class="btn-base btn-secondary" @click="loadDashboard">Muat Ulang</button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article class="stat-card">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pelanggan</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ stats.total_orders }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ stats.today }} pesanan baru hari ini</p>
        </article>

        <article class="stat-card">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pesanan</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ stats.total_orders }}</p>
          <p class="mt-1 text-xs text-amber-600">{{ stats.pending }} belum diproses</p>
        </article>

        <article class="stat-card">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pendapatan</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">Rp {{ Number(stats.total_revenue).toLocaleString('id-ID') }}</p>
          <p class="mt-1 text-xs text-slate-500">Hanya pesanan yang dibayar</p>
        </article>

        <article class="stat-card">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Produk Aktif</p>
          <p class="mt-3 text-3xl font-bold text-emerald-600">{{ stats.total }}</p>
          <p class="mt-1 text-xs text-rose-600">{{ stats.low_stock }} stok menipis</p>
        </article>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-3">
      <article class="panel overflow-hidden xl:col-span-2">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 class="text-sm font-bold text-slate-800">Penjualan Bulanan</h3>
          <span class="text-xs font-semibold text-slate-500">7 hari terakhir</span>
        </div>

        <BarChartOne />

        <!-- <div v-if="stats.revenue7d?.length" class="h-72 px-4 py-5">
          <div class="flex h-full items-end gap-2">
            <div v-for="d in stats.revenue7d" :key="d.day" class="flex flex-1 flex-col items-center justify-end gap-2">
              <div
                class="w-full rounded-t bg-blue-500/70 transition hover:bg-blue-600"
                :style="{ height: `${Math.max((d.revenue / chartMax) * 100, 4)}%` }"
                :title="`Rp ${Number(d.revenue).toLocaleString('id-ID')}`"
              ></div>
              <p class="text-[11px] font-medium text-slate-500">{{ fmtDay(d.day) }}</p>
            </div>
          </div>
        </div>

        <div v-else class="px-4 py-10 text-center text-sm text-slate-500">No revenue data yet</div> -->
      </article>

      <article class="panel p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-slate-800">Target Bulanan</h3>
          <span class="text-xs font-semibold text-blue-600">{{ progressPercent }}%</span>
        </div>

        <p class="mt-1 text-xs text-slate-500">Progres terhadap estimasi target pendapatan bulanan.</p>

        <div class="mt-4 h-2 overflow-hidden rounded bg-slate-100">
          <div class="h-full rounded bg-blue-600" :style="{ width: `${progressPercent}%` }"></div>
        </div>

        <div class="mt-4 space-y-3 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Target</span>
            <span class="font-semibold text-slate-800">Rp {{ monthlyTarget.toLocaleString('id-ID') }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Saat Ini</span>
            <span class="font-semibold text-slate-800">Rp {{ Number(stats.total_revenue || 0).toLocaleString('id-ID') }}</span>
          </div>
          <div class="flex items-center justify-between border-t border-slate-200 pt-3">
            <span class="text-slate-500">Pesanan Hari Ini</span>
            <span class="font-semibold text-slate-800">{{ stats.today }}</span>
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

const chartMax = computed(() => {
  if (!stats.value?.revenue7d?.length) return 1
  return Math.max(...stats.value.revenue7d.map(d => d.revenue), 1)
})

const topMax = computed(() => {
  if (!stats.value?.topProducts?.length) return 1
  return Math.max(...stats.value.topProducts.map(p => p.units_sold), 1)
})

const monthlyTarget = computed(() => {
  const revenue = Number(stats.value?.total_revenue || 0)
  return Math.max(Math.ceil(revenue * 1.25), 1000000)
})

const progressPercent = computed(() => {
  const target = monthlyTarget.value || 1
  const revenue = Number(stats.value?.total_revenue || 0)
  return Math.min(100, Math.round((revenue / target) * 100))
})

function fmtDay(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'short' })
}

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
