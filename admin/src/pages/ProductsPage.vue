<template>
  <div class="space-y-4">
    <section class="panel overflow-hidden">
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <h2 class="text-sm font-bold text-slate-800">Daftar Produk</h2>
        <button class="btn-base btn-primary" @click="openCreate">+ Tambah Produk</button>
      </header>

      <div v-if="!loaded" class="px-4 py-6 text-sm text-slate-600">Loading products…</div>
      <div v-else-if="products.length === 0" class="px-4 py-10 text-center text-sm text-slate-500">No products yet</div>

      <div v-else class="table-wrap">
        <table class="table-base">
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Badge</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td>
                <div class="flex items-center gap-3">
                  <div class="h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <img v-if="p.imageUrl" :src="p.imageUrl" :alt="p.name" class="h-full w-full object-cover" />
                    <div v-else class="flex h-full w-full items-center justify-center text-[10px] font-semibold text-slate-500">IMG</div>
                  </div>
                  <div>
                    <p class="font-semibold text-slate-800">{{ p.name }}</p>
                    <p class="max-w-[210px] truncate text-xs text-slate-500">{{ p.description || '-' }}</p>
                  </div>
                </div>
              </td>
              <td>{{ p.category?.name || '-' }}</td>
              <td>Rp {{ Number(p.price || 0).toLocaleString('id-ID') }}</td>
              <td :class="p.stock < 20 ? 'font-semibold text-red-600' : ''">{{ p.stock }}</td>
              <td>
                <span v-if="p.badge" class="badge border-sky-200 bg-sky-50 text-sky-700">{{ p.badge }}</span>
                <span v-else class="text-xs text-slate-400">—</span>
              </td>
              <td>
                <span class="badge" :class="p.active ? 'badge-delivered' : 'badge-cancelled'">
                  {{ p.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <button class="btn-base btn-secondary" @click="openEdit(p)">Edit</button>
                  <button v-if="p.active" class="btn-base btn-danger" @click="deactivate(p.id)">Deactivate</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-box">
        <h3 class="text-lg font-bold text-slate-900">{{ editing ? 'Edit Product' : 'New Product' }}</h3>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label-base">Name *</label>
            <input class="input-base" v-model="form.name" placeholder="Pantiliner" />
          </div>
          <div>
            <label class="label-base">Price (IDR) *</label>
            <input class="input-base" type="number" v-model="form.price" placeholder="35000" />
          </div>
        </div>

        <div class="mt-4">
          <label class="label-base">Description</label>
          <input class="input-base" v-model="form.description" placeholder="Short product description" />
        </div>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label-base">Product image</label>
            <input class="input-base" type="file" accept="image/png,image/jpeg,image/webp,image/gif" @change="onImageChange" />
            <p class="mt-1 text-xs text-slate-500">Optional. JPG/PNG/WEBP/GIF, max 5MB.</p>
          </div>

          <div>
            <label class="label-base">Category</label>
            <select class="input-base" v-model="form.categoryId">
              <option v-for="category in productCategories" :key="category.id" :value="category.id">
                {{ category.id }} - {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="imagePreview || form.imageUrl" class="mt-4">
          <label class="label-base">Image preview</label>
          <div class="flex items-center gap-3">
            <div class="h-20 w-20 overflow-hidden rounded-lg border border-slate-200">
              <img :src="imagePreview || form.imageUrl" alt="Preview" class="h-full w-full object-cover" />
            </div>
            <button type="button" class="btn-base btn-secondary" @click="removeImage">Remove image</button>
          </div>
        </div>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label-base">Badge (optional)</label>
            <input class="input-base" v-model="form.badge" placeholder="New, Bestseller…" />
          </div>
          <div>
            <label class="label-base">Stock</label>
            <input class="input-base" type="number" v-model="form.stock" placeholder="100" />
          </div>
        </div>

        <div v-if="editing" class="mt-4">
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

const products = ref([])
const productCategories = ref([])
const loaded = ref(false)
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)
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
  const json = await get('/product-categories')
  if (json.success) productCategories.value = json.data
}

function openCreate() {
  editing.value = null
  form.value = defaultForm()
  imageData.value = ''
  imagePreview.value = ''
  removeImageFlag.value = false
  showModal.value = true
}

function openEdit(p) {
  editing.value = p
  form.value = {
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
  const body = {
    ...form.value,
    category_id: +form.value.categoryId,
    price: +form.value.price,
    stock: +form.value.stock,
    imageData: imageData.value || undefined,
    removeImage: removeImageFlag.value,
  }

  const json = editing.value
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
  await Promise.all([loadProducts(), loadProductCategories()])
})
</script>
