<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-logo">AVAIL Jombang<span>.</span></div>
      <div class="login-sub">Admin — sign in to continue</div>

      <p v-if="error" class="login-error">{{ error }}</p>

      <div class="form-group">
        <label class="form-label">Username</label>
        <input class="form-input" v-model="form.username" @keyup.enter="submit" placeholder="admin" />
      </div>
      <div class="form-group">
        <label class="form-label">Password</label>
        <input class="form-input" type="password" v-model="form.password" @keyup.enter="submit" placeholder="••••••••" />
      </div>

      <button class="btn btn-primary" style="width:100%;justify-content:center;padding:12px" @click="submit" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Sign in →' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '../composables/useApi.js'

const emit = defineEmits(['login-success'])
const { post } = useApi()

const form    = ref({ username: '', password: '' })
const error   = ref('')
const loading = ref(false)

async function submit() {
  error.value   = ''
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
