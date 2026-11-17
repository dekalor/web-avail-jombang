<template>
  <div class="space-y-4">
    <section class="panel overflow-hidden">
      <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <h2 class="text-sm font-bold text-slate-800">Daftar Testimoni Pelanggan</h2>
          <p class="text-xs text-slate-500 mt-0.5">Kelola foto & video cerita pengalaman pengguna AVAIL</p>
        </div>
        <button class="btn-base btn-primary" @click="openCreate">+ Tambah Testimoni</button>
      </header>

      <div v-if="!loaded" class="px-4 py-6 text-sm text-slate-600">Memuat testimoni…</div>
      <div v-else-if="testimonials.length === 0" class="px-4 py-10 text-center text-sm text-slate-500">
        Belum ada testimoni. Klik tombol "+ Tambah Testimoni" untuk menambahkan.
      </div>

      <div v-else class="table-wrap">
        <table class="table-base">
          <thead>
            <tr>
              <th class="w-16">Urutan</th>
              <th class="w-20">Media</th>
              <th>Nama Pelanggan</th>
              <th>Judul</th>
              <th>Tipe</th>
              <th>Status</th>
              <th class="text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in testimonials" :key="item.id">
              <td class="font-mono text-xs font-semibold text-slate-600">
                #{{ item.sortOrder }}
              </td>
              <td>
                <div class="w-12 h-14 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
                  <img
                    v-if="item.mediaType === 'image' || item.type === 'image'"
                    :src="item.mediaUrl"
                    :alt="item.customerName"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="text-xs font-medium text-slate-500 flex flex-col items-center">
                    <span>🎬</span>
                    <span class="text-[9px]">Video</span>
                  </div>
                </div>
              </td>
              <td>
                <p class="font-semibold text-slate-800">{{ item.customerName }}</p>
                <p class="text-xs text-slate-500 line-clamp-1 max-w-xs">{{ item.caption }}</p>
              </td>
              <td class="text-slate-700 text-xs sm:text-sm">
                {{ item.title || '-' }}
              </td>
              <td>
                <span
                  class="badge text-xs"
                  :class="item.mediaType === 'video' || item.type === 'video' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'"
                >
                  {{ (item.mediaType === 'video' || item.type === 'video') ? 'Video' : 'Foto' }}
                </span>
              </td>
              <td>
                <span class="badge" :class="item.active ? 'badge-delivered' : 'badge-cancelled'">
                  {{ item.active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-2">
                  <button class="btn-base btn-secondary" @click="openEdit(item)">Ubah</button>
                  <button
                    v-if="item.active"
                    class="btn-base btn-danger"
                    @click="deactivate(item.id)"
                  >
                    Nonaktifkan
                  </button>
                  <button
                    v-else
                    class="btn-base btn-secondary"
                    @click="activate(item)"
                  >
                    Aktifkan
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Modal Form -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-box max-w-lg">
        <h3 class="text-lg font-bold text-slate-900">
          {{ editing ? 'Ubah Testimoni' : 'Tambah Testimoni Baru' }}
        </h3>

        <div class="mt-4 space-y-3.5">
          <div>
            <label class="label-base">Nama Pelanggan <span class="text-red-500">*</span></label>
            <input class="input-base" v-model="form.customerName" placeholder="Contoh: Kristiani Apu" />
          </div>

          <div>
            <label class="label-base">Judul / Headline</label>
            <input class="input-base" v-model="form.title" placeholder="Contoh: Ulasan pelanggan" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label-base">Tipe Media <span class="text-red-500">*</span></label>
              <select class="input-base" v-model="form.mediaType">
                <option value="image">Foto (Image)</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label class="label-base">Urutan Tampil</label>
              <input type="number" class="input-base" v-model.number="form.sortOrder" min="1" />
            </div>
          </div>

          <div>
            <label class="label-base">URL Media (Cloudinary) <span class="text-red-500">*</span></label>
            <input class="input-base" v-model="form.mediaUrl" placeholder="https://res.cloudinary.com/..." />
          </div>

          <div>
            <label class="label-base">Isi Testimoni / Caption</label>
            <textarea
              class="input-base min-h-[90px]"
              v-model="form.caption"
              placeholder="Cerita atau pengalaman pelanggan setelah menggunakan produk..."
            ></textarea>
          </div>

          <div v-if="editing">
            <label class="label-base">Status</label>
            <select class="input-base" v-model="form.active">
              <option :value="1">Aktif</option>
              <option :value="0">Nonaktif</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button class="btn-base btn-secondary" @click="showModal = false">Batal</button>
          <button class="btn-base btn-primary" @click="save" :disabled="saving">
            {{ saving ? 'Menyimpan…' : (editing ? 'Simpan Perubahan' : 'Buat Testimoni') }}
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

const testimonials = ref([])
const loaded = ref(false)
const showModal = ref(false)
const editing = ref(null)
const saving = ref(false)

function defaultForm() {
  return {
    customerName: '',
    title: '',
    caption: '',
    mediaType: 'image',
    mediaUrl: '',
    sortOrder: (testimonials.value.length + 1) || 1,
    active: 1,
  }
}

const form = ref(defaultForm())

async function loadTestimonials() {
  loaded.value = false
  const json = await get('/testimonials')
  if (json.success && Array.isArray(json.data)) {
    testimonials.value = json.data
  }
  loaded.value = true
}

function openCreate() {
  editing.value = null
  form.value = defaultForm()
  showModal.value = true
}

function openEdit(item) {
  editing.value = item
  form.value = {
    customerName: item.customerName || '',
    title: item.title || '',
    caption: item.caption || '',
    mediaType: item.mediaType || item.type || 'image',
    mediaUrl: item.mediaUrl || '',
    sortOrder: item.sortOrder ?? 1,
    active: item.active ? 1 : 0,
  }
  showModal.value = true
}

async function save() {
  if (!form.value.customerName.trim()) {
    alert('Nama pelanggan harus diisi')
    return
  }
  if (!form.value.mediaUrl.trim()) {
    alert('URL media harus diisi')
    return
  }

  saving.value = true
  const payload = {
    customerName: form.value.customerName.trim(),
    title: form.value.title?.trim() || null,
    caption: form.value.caption?.trim() || null,
    mediaType: form.value.mediaType,
    mediaUrl: form.value.mediaUrl.trim(),
    sortOrder: Number(form.value.sortOrder) || 1,
    active: !!form.value.active,
  }

  try {
    let res
    if (editing.value) {
      res = await put(`/testimonials/${editing.value.id}`, payload)
    } else {
      res = await post('/testimonials', payload)
    }

    if (res.success) {
      showModal.value = false
      await loadTestimonials()
    } else {
      alert(res.message || 'Gagal menyimpan testimoni')
    }
  } catch (err) {
    alert('Terjadi kesalahan')
  } finally {
    saving.value = false
  }
}

async function deactivate(id) {
  if (!confirm('Nonaktifkan testimoni ini?')) return
  const res = await del(`/testimonials/${id}`)
  if (res.success) {
    await loadTestimonials()
  } else {
    alert(res.message || 'Gagal menonaktifkan')
  }
}

async function activate(item) {
  const res = await put(`/testimonials/${item.id}`, { active: true })
  if (res.success) {
    await loadTestimonials()
  } else {
    alert(res.message || 'Gagal mengaktifkan')
  }
}

onMounted(() => {
  loadTestimonials()
})
</script>
