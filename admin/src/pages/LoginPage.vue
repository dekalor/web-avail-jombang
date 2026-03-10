<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-8">
    <div class="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800/95 p-7 shadow-2xl shadow-slate-950/40">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">AVAIL Jombang</p>
      <h1 class="mt-2 text-2xl font-bold text-white">Sign in to admin</h1>
      <p class="mt-1 text-sm text-slate-400">Manage products, categories, and orders.</p>

      <p v-if="error" class="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
        {{ error }}
      </p>

      <div class="mt-5 space-y-4">
        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Username</label>
          <input
            v-model="form.username"
            class="input-base border-slate-600 bg-slate-900 text-slate-100 placeholder:text-slate-500"
            placeholder="admin"
            @keyup.enter="submit"
          />
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input-base border-slate-600 bg-slate-900 text-slate-100 placeholder:text-slate-500 pr-12"
              placeholder="••••••••"
              @keyup.enter="submit"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-300 hover:text-white"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <EyeOff v-if="showPassword" class="h-4 w-4" />
              <Eye v-else class="h-4 w-4" />
            </button>
          </div>
        </div>

        <button class="btn-base w-full bg-blue-600 text-white hover:bg-blue-700" @click="submit" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useApi } from '../composables/useApi.js'

const emit = defineEmits(['login-success'])
const { post } = useApi()

const form = ref({ username: '', password: '' })
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  const json = await post('/login', form.value).catch(() => null)
  loading.value = false

  if (json?.success) {
    emit('login-success')
  } else {
    error.value = json?.message || 'Invalid credentials'
  }
}
</script>
