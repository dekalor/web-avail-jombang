<template>
  <div v-if="!loaded" class="loading">Loading dashboard…</div>

  <div v-else class="content">
    <!-- Stat cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-label">Total Pesanan</div>
        <div class="stat-value">{{ stats.total_orders }}</div>
        <div class="stat-sub">{{ stats.today }} today</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-label">Total Pendapatan</div>
        <div class="stat-value" style="font-size:26px">Rp {{ Number(stats.total_revenue).toLocaleString('id-ID') }}
        </div>
        <div class="stat-sub">tidak termasuk cancelled</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <div class="stat-label">Pesanan Belum Diproses</div>
        <div class="stat-value">{{ stats.pending }}</div>
        <div class="stat-sub">butuh di proses</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🌸</div>
        <div class="stat-label">Produk Aktif</div>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-sub">{{ stats.low_stock }} low stock</div>
      </div>
    </div>

    <!-- Revenue chart + top products -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">

      <div class="card">
        <div class="card-header"><span class="card-title">Pendapatan — 7 hari terakhir</span></div>
        <div class="chart-wrap">
          <div v-if="stats.revenue7d?.length" class="chart-bars">
            <div class="chart-bar-col" v-for="d in stats.revenue7d" :key="d.day">
              <div class="chart-bar" :style="{ height: ((d.revenue / chartMax) * 100) + 'px' }"
                :title="'Rp ' + Number(d.revenue).toLocaleString('id-ID')"></div>
              <div class="chart-label">{{ fmtDay(d.day) }}</div>
            </div>
          </div>
          <div v-else class="empty-state" style="padding:20px">
            <div class="empty-icon">📉</div>
            <p>No revenue data yet</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Produk terlaris berdasarkan jumlah penjualan</span></div>
        <div v-if="stats.topProducts?.length">
          <div class="top-product-row" v-for="(p, i) in stats.topProducts" :key="p.product_name">
            <div class="top-rank">{{ i + 1 }}</div>
            <div style="flex:1">
              <div style="font-size:13px;margin-bottom:5px">{{ p.product_name }}</div>
              <div class="top-bar-wrap">
                <div class="top-bar" :style="{ width: ((p.units_sold / topMax) * 100) + '%' }"></div>
              </div>
            </div>
            <div class="top-units">{{ p.units_sold }} units</div>
          </div>
        </div>
        <div v-else class="empty-state" style="padding:20px">
          <div class="empty-icon">🛍️</div>
          <p>No sales yet</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useApi }      from '../composables/useApi.js'

const { get } = useApi()

const stats = ref(null);
const loaded = ref(false);

async function loadDashboard() {
  loaded.value = false;
  const json = await get('/dashboard');
  if (json.success) { stats.value = json.data; }
  loaded.value = true;
}

const chartMax = computed(() => {
  if (!stats.value?.revenue7d?.length) return 1;
  return Math.max(...stats.value.revenue7d.map(d => d.revenue), 1);
});

const topMax = computed(() => {
  if (!stats.value?.topProducts?.length) return 1;
  return Math.max(...stats.value.topProducts.map(p => p.units_sold), 1);
});

function fmtDay(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'short' });
}
onMounted(loadDashboard)
</script>