<template>
  <div class="space-y-4">
    <section class="panel overflow-hidden">
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <h2 class="text-sm font-bold text-slate-800">Daftar Produk</h2>
        <button class="btn-base btn-primary" @click="openCreate">+ Tambah Produk</button>
      </header>

      <div v-if="!loaded" class="px-4 py-6 text-sm text-slate-600">Memuat produk…</div>
      <div v-else-if="products.length === 0" class="px-4 py-10 text-center text-sm text-slate-500">Belum ada produk</div>

      <div v-else class="table-wrap">
        <table class="table-base">
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Unit Produk</th>
              <th>Stok</th>
              <th>Badge</th>
              <th>Status</th>
              <th>Aksi</th>
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
              <td>
                <div class="flex max-w-[260px] flex-wrap gap-1.5">
                  <span
                    v-for="unit in sortedUnits(p.units)"
                    :key="unit.id || `${p.id}-${unit.unitCode}`"
                  >
                    <Badge size="sm" color="info">
                      {{ unit.label || unit.unitCode?.toUpperCase() }}:
                      Rp {{ Number(unit.price || 0).toLocaleString('id-ID') }}
                    </Badge>
                  </span>
                  <span v-if="!p.units?.length" class="text-xs text-slate-400">—</span>
                </div>
              </td>
              <td :class="p.stock < 20 ? 'font-semibold text-red-600' : ''">{{ p.stock }}</td>
              <td>
                <Badge v-if="p.badge" size="sm" color="info">{{ p.badge }}</Badge>
                <span v-else class="text-xs text-slate-400">—</span>
              </td>
              <td>
                <Badge size="sm" :color="p.active ? 'success' : 'error'">
                  {{ p.active ? 'Aktif' : 'Nonaktif' }}
                </Badge>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <button class="btn-base btn-secondary" @click="openEdit(p)">Ubah</button>
                  <button v-if="p.active" class="btn-base btn-danger" @click="deactivate(p.id)">Nonaktifkan</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-box">
        <h3 class="text-lg font-bold text-slate-900">{{ editing ? 'Ubah Produk' : 'Produk Baru' }}</h3>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label-base">Nama *</label>
            <input class="input-base" v-model="form.name" placeholder="Pantiliner" />
          </div>
        </div>

        <div class="mt-4">
          <label class="label-base">Deskripsi</label>
          <input class="input-base" v-model="form.description" placeholder="Deskripsi singkat produk" />
        </div>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label-base">Gambar Produk</label>
            <input class="input-base" type="file" accept="image/png,image/jpeg,image/webp,image/gif" @change="onImageChange" />
            <p class="mt-1 text-xs text-slate-500">Opsional. JPG/PNG/WEBP/GIF, maksimal 5MB.</p>
          </div>

          <div>
            <label class="label-base">Kategori</label>
            <select class="input-base" v-model="form.categoryId">
              <option v-for="category in productCategories" :key="category.id" :value="category.id">
                {{ category.id }} - {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="mt-4">
          <div class="mb-2 flex items-center justify-between">
            <label class="label-base !mb-0">Satuan Produk *</label>
            <button type="button" class="btn-base btn-secondary" @click="addUnit">+ Tambah Satuan</button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(unit, idx) in form.units"
              :key="`unit-${idx}`"
              class="rounded-lg border border-slate-200 p-3"
            >
              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                <div>
                  <label class="label-base">Kode Satuan</label>
                  <input class="input-base" v-model="unit.unitCode" placeholder="pcs / bal / box" />
                </div>
                <div>
                  <label class="label-base">Label</label>
                  <input class="input-base" v-model="unit.label" placeholder="PCS / BAL / BOX" />
                </div>
                <div>
                  <label class="label-base">Harga</label>
                  <input class="input-base" type="number" v-model="unit.price" placeholder="35000" />
                </div>
                <div>
                  <label class="label-base">Berat (gr)</label>
                  <input class="input-base" type="number" v-model="unit.weight" placeholder="50" />
                </div>
                <div>
                  <label class="label-base">Qty / Satuan</label>
                  <input class="input-base" type="number" v-model="unit.qtyPerUnit" placeholder="1" />
                </div>
                <div>
                  <label class="label-base">Status</label>
                  <select class="input-base" v-model="unit.active">
                    <option :value="1">Aktif</option>
                    <option :value="0">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div class="mt-3 flex justify-end">
                <button
                  type="button"
                  class="btn-base btn-danger"
                  :disabled="form.units.length === 1"
                  @click="removeUnit(idx)"
                >
                  Hapus Satuan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="imagePreview || form.imageUrl" class="mt-4">
          <label class="label-base">Pratinjau Gambar</label>
          <div class="flex items-center gap-3">
            <div class="h-20 w-20 overflow-hidden rounded-lg border border-slate-200">
              <img :src="imagePreview || form.imageUrl" alt="Preview" class="h-full w-full object-cover" />
            </div>
            <button type="button" class="btn-base btn-secondary" @click="removeImage">Hapus Gambar</button>
          </div>
        </div>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="label-base">Badge (opsional)</label>
            <input class="input-base" v-model="form.badge" placeholder="Baru, Terlaris…" />
          </div>
          <div>
            <label class="label-base">Stock</label>
            <input class="input-base" type="number" v-model="form.stock" placeholder="100" />
          </div>
        </div>

        <div v-if="editing" class="mt-4">
          <label class="label-base">Status</label>
          <select class="input-base" v-model="form.active">
            <option :value="1">Aktif</option>
            <option :value="0">Nonaktif</option>
          </select>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button class="btn-base btn-secondary" @click="showModal = false">Batal</button>
          <button class="btn-base btn-primary" @click="save" :disabled="saving">
            {{ saving ? 'Menyimpan…' : (editing ? 'Simpan Perubahan' : 'Buat Produk') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi.js'
import Badge from '../components/ui/Badge.vue'

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
  return {
    name: '',
    description: '',
    categoryId: 1,
    imageUrl: '',
    badge: '',
    stock: 100,
    active: 1,
    units: [defaultUnit()],
  }
}
const form = ref(defaultForm())

function defaultUnit() {
  return {
    unitCode: 'pcs',
    label: 'PCS',
    price: '',
    weight: 50,
    qtyPerUnit: 1,
    active: 1,
  }
}

function sortedUnits(units) {
  if (!Array.isArray(units)) return []
  return [...units].sort((a, b) => Number(a.id || 0) - Number(b.id || 0))
}

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
    units: sortedUnits(p.units).map((unit) => ({
      id: unit.id,
      unitCode: unit.unitCode || '',
      label: unit.label || '',
      price: Number(unit.price || 0),
      weight: Number(unit.weight || 0),
      qtyPerUnit: Number(unit.qtyPerUnit || 1),
      active: unit.active ? 1 : 0,
    })),
  }
  if (!form.value.units.length) form.value.units = [defaultUnit()]
  imageData.value = ''
  imagePreview.value = ''
  removeImageFlag.value = false
  showModal.value = true
}

async function save() {
  saving.value = true
  const normalizedUnits = (Array.isArray(form.value.units) ? form.value.units : [])
    .map((unit) => ({
      ...(unit.id ? { id: unit.id } : {}),
      unitCode: String(unit.unitCode || '').trim().toLowerCase(),
      label: String(unit.label || '').trim(),
      price: Number(unit.price || 0),
      weight: Number(unit.weight || 0),
      qtyPerUnit: Number(unit.qtyPerUnit || 1),
      active: Number(unit.active) ? 1 : 0,
    }))
    .filter((unit) => unit.unitCode && unit.price > 0 && unit.weight > 0 && unit.qtyPerUnit > 0)

  if (!normalizedUnits.length) {
    saving.value = false
    return alert('Minimal satu product unit aktif dengan harga/berat valid.')
  }

  const body = {
    ...form.value,
    category_id: +form.value.categoryId,
    stock: +form.value.stock,
    units: normalizedUnits,
    imageData: imageData.value || undefined,
    removeImage: removeImageFlag.value,
  }

  const json = editing.value
    ? await put(`/products/${editing.value.id}`, body)
    : await post('/products', body)

  saving.value = false
  if (!json.success) return alert(json.message || 'Gagal menyimpan produk')

  if (editing.value) {
    const idx = products.value.findIndex(p => p.id === editing.value.id)
    if (idx !== -1) products.value[idx] = json.data
  } else {
    products.value.push(json.data)
  }
  showModal.value = false
}

function addUnit() {
  form.value.units.push(defaultUnit())
}

function removeUnit(index) {
  if (form.value.units.length <= 1) return
  form.value.units.splice(index, 1)
}

function onImageChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran gambar terlalu besar. Maksimal 5MB.')
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
  if (!confirm('Nonaktifkan produk ini?')) return
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
