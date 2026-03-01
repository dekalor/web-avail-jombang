<template>
  <div>
    <div
      v-if="open"
      class="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
      @click="$emit('close')"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white transition-transform duration-200 md:translate-x-0"
      :class="open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    >
      <div class="flex h-full flex-col">
        <div class="border-b border-slate-200 px-5 py-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-extrabold tracking-tight text-slate-900">AVAIL Jombang</h2>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">TailAdmin UI</p>
            </div>
            <button class="text-slate-500 md:hidden" @click="$emit('close')">✕</button>
          </div>
        </div>

        <nav class="flex-1 space-y-1 p-4">
          <button
            v-for="p in pages"
            :key="p.id"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition"
            :class="currentPage === p.id
              ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
            @click="$emit('navigate', p.id)"
          >
            <span>{{ p.icon }}</span>
            <span>{{ p.label }}</span>
          </button>
        </nav>

        <div class="space-y-2 border-t border-slate-200 p-4">
          <a href="/" target="_blank" class="btn-base btn-secondary w-full">🛍️ Lihat Toko</a>
          <button class="btn-base btn-danger w-full" @click="$emit('logout')">🚪 Logout</button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: String, required: true },
  pages: { type: Array, required: true },
  open: { type: Boolean, default: false },
})
defineEmits(['navigate', 'logout', 'close'])
</script>
