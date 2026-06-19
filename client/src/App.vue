<template>
  <Analytics />
  <SpeedInsights />
  <router-view />
  <error-modal />
</template>

<script setup>
import ErrorModal from './components/ErrorModal.vue';
import { Analytics } from "@vercel/analytics/vue";
import { SpeedInsights } from "@vercel/speed-insights/vue";
</script>