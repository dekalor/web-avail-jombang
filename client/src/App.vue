<template>
  <Analytics />
  <router-view />
  <error-modal />
</template>

<script setup>
import ErrorModal from './components/ErrorModal.vue';
import { Analytics } from "@vercel/analytics/vue"
</script>