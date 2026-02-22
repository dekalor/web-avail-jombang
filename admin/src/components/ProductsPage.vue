<template>
  <div class="content">
    <div class="card">
      <div class="card-header">
        <span class="card-title">Daftar Produk</span>
        <button class="btn btn-sage" @click="openCreate">+ Tambah Produk</button>
      </div>

      <div v-if="!loaded" class="loading">Loading products…</div>
      <div v-else-if="products.length === 0" class="empty-state">
        <div class="empty-icon">🌸</div><p>No products yet</p>
      </div>

      <table v-else>
        <thead>
          <tr><th>Nama Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Badge</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;overflow:hidden" :style="{ background: 'white' }">
                  <img
                    v-if="p.imageUrl"
                    :src="p.imageUrl"
                    :alt="p.name"
                    style="width:100%;height:100%;object-fit:cover"
                  />
                  <span v-else style="font-size:10px;font-weight:600;color:#6b6b6b">IMG</span>
                </div>
                <div>
                  <div style="font-weight:500">{{ p.name }}</div>
                  <div style="font-size:12px;color:var(--mid)">{{ p.description?.slice(0,40) }}…</div>
                </div>
              </div>
            </td>
            <td>{{ p.category.name }}</td>
            <td>Rp {{ Number(p.price).toLocaleString('id-ID') }}</td>
            <td :style="{ color: p.stock < 20 ? 'var(--danger)' : 'inherit', fontWeight: p.stock < 20 ? 600 : 400 }">{{ p.stock }}</td>
            <td>
              <span v-if="p.badge" class="badge" style="background:var(--sage-light);color:var(--sage)">{{ p.badge }}</span>
              <span v-else style="color:var(--mid);font-size:12px">—</span>
            </td>
            <td>
              <span class="badge" :class="p.active ? 'badge-delivered' : 'badge-cancelled'">
                {{ p.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <div style="display:flex;gap:8px">
                <button class="btn btn-ghost btn-sm" @click="openEdit(p)">Edit</button>
                <button v-if="p.active" class="btn btn-danger btn-sm" @click="deactivate(p.id)">Deactivate</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product modal -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-box">
        <div class="modal-title">{{ editing ? 'Edit Product' : 'New Product' }}</div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Name *</label>
            <input class="form-input" v-model="form.name" placeholder="Pantiliner" />
          </div>
          <div class="form-group">
            <label class="form-label">Price (IDR) *</label>
            <input class="form-input" type="number" v-model="form.price" placeholder="35000" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <input class="form-input" v-model="form.description" placeholder="Short product description" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Product image</label>
            <input class="form-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" @change="onImageChange" />
            <div style="font-size:12px;color:var(--mid);margin-top:6px">Optional. JPG/PNG/WEBP/GIF, max 5MB.</div>
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-input select-input" v-model="form.categoryId" style="width:100%">
              <option v-for="category in productCategories" :key="category.id" :value="category.id">
                {{ category.id }} - {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="imagePreview || form.imageUrl" class="form-group">
          <label class="form-label">Image preview</label>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:80px;height:80px;border-radius:10px;overflow:hidden;border:1px solid var(--border);background:var(--white)">
              <img :src="imagePreview || form.imageUrl" alt="Preview" style="width:100%;height:100%;object-fit:cover" />
            </div>
            <button type="button" class="btn btn-ghost btn-sm" @click="removeImage">Remove image</button>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Badge (optional)</label>
            <input class="form-input" v-model="form.badge" placeholder="New, Bestseller…" />
          </div>
          <div class="form-group">
            <label class="form-label">Stock</label>
            <input class="form-input" type="number" v-model="form.stock" placeholder="100" />
          </div>
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

const products  = ref([])
const productCategories = ref([])
const loaded    = ref(false)
const showModal = ref(false)
const editing   = ref(null)
const saving    = ref(false)
const imageData = ref('')
const imagePreview = ref('')
const removeImageFlag = ref(false)

function defaultForm() {
  return { name: '', description: '', categoryId: 1, price: '', imageUrl: '', badge: '', stock: 100, active: 1 }
}
const form = ref(defaultForm())

async function loadProducts() {
  loaded.value = false
  const json = await get('/products')
  if (json.success) products.value = json.data
  loaded.value = true
}

async function loadProductCategories() {
  loaded.value = false
  const json = await get('/product-categories')
  if (json.success) productCategories.value = json.data
  loaded.value = true
}

function openCreate() {
  editing.value   = null
  form.value      = defaultForm()
  imageData.value = ''
  imagePreview.value = ''
  removeImageFlag.value = false
  showModal.value = true
}

function openEdit(p) {
  editing.value   = p
  form.value      = {
    ...p,
    categoryId: +(p.categoryId ?? p.category_id ?? p.category?.id ?? 1),
    imageUrl: p.imageUrl || '',
    badge: p.badge || '',
    active: p.active ? 1 : 0,
  }
  imageData.value = ''
  imagePreview.value = ''
  removeImageFlag.value = false
  showModal.value = true
}

async function save() {
  saving.value = true
  const body   = {
    ...form.value,
    category_id: +form.value.categoryId,
    price: +form.value.price,
    stock: +form.value.stock,
    imageData: imageData.value || undefined,
    removeImage: removeImageFlag.value,
  }
  const json   = editing.value
    ? await put(`/products/${editing.value.id}`, body)
    : await post('/products', body)

  saving.value = false
  if (!json.success) return alert(json.message || 'Error saving product')

  if (editing.value) {
    const idx = products.value.findIndex(p => p.id === editing.value.id)
    if (idx !== -1) products.value[idx] = json.data
  } else {
    products.value.push(json.data)
  }
  showModal.value = false
}

function onImageChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('Image too large. Max 5MB.')
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    imageData.value = String(reader.result || '')
    imagePreview.value = imageData.value
    removeImageFlag.value = false
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  imageData.value = ''
  imagePreview.value = ''
  form.value.imageUrl = ''
  removeImageFlag.value = true
}

async function deactivate(id) {
  if (!confirm('Deactivate this product?')) return
  const json = await del(`/products/${id}`)
  if (json.success) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) products.value[idx].active = 0
  }
}

onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadProductCategories()
  ])
})
</script>
