<template>
  <div class="sidebar">
    <div>
      <div class="sidebar-logo">AVAIL Jombang<span>.</span></div>
      <div class="sidebar-role">Admin Panel</div>
    </div>

    <nav class="sidebar-nav">
      <button
        v-for="p in pages" :key="p.id"
        class="nav-item"
        :class="{ active: currentPage === p.id }"
        @click="$emit('navigate', p.id)"
      >
        <span class="nav-icon">{{ p.icon }}</span>
        {{ p.label }}
      </button>
    </nav>

    <div class="sidebar-footer">
      <a href="/" target="_blank" class="logout-btn" style="text-decoration:none;margin-bottom:6px">
        <span>🛍️</span> Lihat Toko
      </a>
      <button class="logout-btn" @click="$emit('logout')">
        <span>🚪</span> Logout
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: String, required: true },
  pages:       { type: Array,  required: true },
})
defineEmits(['navigate', 'logout'])
</script>
