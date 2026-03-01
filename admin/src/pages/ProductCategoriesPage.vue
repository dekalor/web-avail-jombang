<template>
  <div class="space-y-4">
    <section class="panel overflow-hidden">
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <h2 class="text-sm font-bold text-slate-800">Product Categories</h2>
        <button class="btn-base btn-primary" @click="openCreate">+ Add Category</button>
      </header>

      <div v-if="!loaded" class="px-4 py-6 text-sm text-slate-600">Loading product categories…</div>
      <div v-else-if="productCategories.length === 0" class="px-4 py-10 text-center text-sm text-slate-500">No product categories yet</div>

      <div v-else class="table-wrap">
        <table class="table-base">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in productCategories" :key="category.id">
              <td class="font-medium text-slate-800">{{ category.name }}</td>
              <td>
                <span class="badge" :class="category.active ? 'badge-delivered' : 'badge-cancelled'">
                  {{ category.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <button class="btn-base btn-secondary" @click="openEdit(category)">Edit</button>
                  <button v-if="category.active" class="btn-base btn-danger" @click="deactivate(category.id)">Deactivate</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-box max-w-md">
        <h3 class="text-lg font-bold text-slate-900">{{ editing ? 'Edit Product Category' : 'New Product Category' }}</h3>

        <div class="mt-4">
          <label class="label-base">Name</label>
          <input class="input-base" v-model="form.name" />
        </div>

        <div class="mt-4" v-if="editing">
          <label class="label-base">Status</label>
          <select class="input-base" v-model="form.active">
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </select>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button class="btn-base btn-secondary" @click="showModal = false">Cancel</button>
          <button class="btn-base btn-primary" @click="save" :disabled="saving">
            {{ saving ? 'Saving…' : (editing ? 'Update' : 'Create') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi.js'

const { get, post, put, delete: del } = useApi()

const productCategories = ref([])
const loaded = ref(false)
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)

function defaultForm() {
  return { name: '', active: 1 }
}
const form = ref(defaultForm())

async function loadProductCategories() {
  loaded.value = false
  const json = await get('/product-categories')
  if (json.success) productCategories.value = json.data
  loaded.value = true
}

function openCreate() {
  editing.value = null
  form.value = defaultForm()
  showModal.value = true
}

function openEdit(category) {
  editing.value = category
  form.value = {
    ...category,
    active: category.active ? 1 : 0,
  }
  showModal.value = true
}

async function save() {
  saving.value = true
  const body = { ...form.value }
  const json = editing.value
    ? await put(`/product-categories/${editing.value.id}`, body)
    : await post('/product-categories', body)

  saving.value = false
  if (!json.success) return alert(json.message || 'Error saving product category')

  if (editing.value) {
    const idx = productCategories.value.findIndex(category => category.id === editing.value.id)
    if (idx !== -1) productCategories.value[idx] = json.data
  } else {
    productCategories.value.push(json.data)
  }
  showModal.value = false
}

async function deactivate(id) {
  if (!confirm('Deactivate this product categories?')) return
  const json = await del(`/product-categories/${id}`)
  if (json.success) {
    const idx = productCategories.value.findIndex(p => p.id === id)
    if (idx !== -1) productCategories.value[idx].active = 0
  }
}

onMounted(loadProductCategories)
</script>
