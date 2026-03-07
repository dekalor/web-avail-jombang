<template>
  <div class="max-w-full overflow-x-auto custom-scrollbar">
    <div id="chartOne" class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
      <VueApexCharts type="bar" height="180" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  categories: {
    type: Array,
    default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  },
  seriesData: {
    type: Array,
    default: () => [168, 385, 201, 298, 187, 195, 291],
  },
  seriesName: {
    type: String,
    default: 'Penjualan',
  },
})

const series = computed(() => [
  {
    name: props.seriesName,
    data: props.seriesData,
  },
])

function formatCompactRupiah(value) {
  const num = Number(value || 0)
  const abs = Math.abs(num)

  if (abs >= 1_000_000_000) return `Rp ${(num / 1_000_000_000)} M`
  if (abs >= 1_000_000) return `Rp ${(num / 1_000_000)} Jt`
  if (abs >= 1_000) return `Rp ${(num / 1_000)} Rb`
  return `Rp ${num}`
}

const chartOptions = computed(() => ({
  colors: ['#465fff'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '39%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 4,
    colors: ['transparent'],
  },
  xaxis: {
    categories: props.categories,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Outfit',
    markers: {
      radius: 99,
    },
  },
  yaxis: {
    title: false,
    labels: {
      formatter: function (val) {
        return formatCompactRupiah(val)
      },
    },
  },
  grid: {
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      formatter: function (val) {
        return `Rp ${Number(val || 0).toLocaleString('id-ID')}`
      },
    },
  },
}))
</script>
