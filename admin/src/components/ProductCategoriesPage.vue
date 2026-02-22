<template>
  <div class="content">
    <div class="card">
      <div class="card-header">
        <span class="card-title">Product Categories</span>
        <button class="btn btn-sage" @click="openCreate">+ Add Categories</button>
      </div>

      <div v-if="!loaded" class="loading">Loading product categories…</div>
      <div v-else-if="productCategories.length === 0" class="empty-state">
        <div class="empty-icon"></div>
        <p>No product categories yet</p>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in productCategories" :key="category.id">
            <td>{{ category.name }}</td>
            <td>
              <span class="badge" :class="category.active ? 'badge-delivered' : 'badge-cancelled'">
                {{ category.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <div style="display:flex;gap:8px">
                <button class="btn btn-ghost btn-sm" @click="openEdit(category)">Edit</button>
                <button v-if="category.active" class="btn btn-danger btn-sm"
                  @click="deactivate(category.id)">Deactivate</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product modal -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-box">
        <div class="modal-title">{{ editing ? 'Edit Product Category' : 'New Product Category' }}</div>

        <div class="form-group">
          <label class="form-label">Name</label>
          <input class="form-input" v-model="form.name" />
        </div>

        <div v-if="editing" class="form-group">
          <label class="form-label">Status</label>
          <select class="form-input select-input" v-model="form.active" style="width:100%">
            <option :value="1">Active</option>
            <option :value="0">Inactive</option>
          </select>
        </div>

        <div class="modal-actions">
          <button class="btn btn-ghost" @click="showModal = false">Cancel</button>
          <button class="btn btn-sage" @click="save" :disabled="saving">
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
  const body = {
    ...form.value,
  }
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
