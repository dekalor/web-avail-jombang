<template>
  <div class="modal-wrap" @click.self="$emit('close')">
    <div class="modal">

      <!-- Success -->
      <div v-if="orderPlaced" class="success-wrap">
        <div class="success-icon">🌿</div>
        <div class="success-title">Order placed!</div>
        <div class="success-sub">
          Thanks {{ form.name }}! We'll send your order to:<br>
          <strong>{{ form.address }}, {{ form.city }}</strong>
        </div>
        <button class="btn-primary" @click="$emit('success')">Continue shopping</button>
      </div>

      <!-- Form -->
      <template v-else>
        <div class="modal-title">Delivery details</div>
        <div class="modal-sub">No account needed — just fill in your address.</div>

        <div class="order-summary">
          <div class="order-summary-title">Order summary</div>
          <div class="order-line" v-for="item in cart" :key="item.id">
            <span>{{ item.name }} × {{ item.qty }}</span>
            <span>Rp {{ (item.price * item.qty).toLocaleString('id-ID') }}</span>
          </div>
          <div class="order-total">
            <span>Total</span>
            <span>Rp {{ grandTotal.toLocaleString('id-ID') }}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Full name</label>
          <input class="form-input" v-model="form.name" placeholder="e.g. Sari Dewi" />
        </div>
        <div class="form-group">
          <label class="form-label">Phone number</label>
          <input class="form-input" v-model="form.phone" placeholder="e.g. 0812-xxxx-xxxx" />
        </div>
        <div class="form-group">
          <label class="form-label">Street address</label>
          <input class="form-input" v-model="form.address" placeholder="e.g. Jl. Melati No. 12" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">City</label>
            <input class="form-input" v-model="form.city" placeholder="e.g. Jakarta" />
          </div>
          <div class="form-group">
            <label class="form-label">Postal code</label>
            <input class="form-input" v-model="form.postal" placeholder="e.g. 12345" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Notes (optional)</label>
          <input class="form-input" v-model="form.notes" placeholder="e.g. Leave at the door" />
        </div>

        <div class="modal-actions">
          <button class="btn-ghost" @click="$emit('close')">← Back</button>
          <button class="btn-place" :disabled="!formValid || loading" @click="placeOrder">
            {{ loading ? 'Placing…' : 'Place order 🌱' }}
          </button>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  cart:       { type: Array,  default: () => [] },
  grandTotal: { type: Number, default: 0 },
})
const emit = defineEmits(['close', 'success'])

const orderPlaced = ref(false)
const loading     = ref(false)
const form = ref({ name: '', phone: '', address: '', city: '', postal: '', notes: '' })

const formValid = computed(() =>
  form.value.name && form.value.phone && form.value.address &&
  form.value.city && form.value.postal
)

async function placeOrder() {
  if (!formValid.value) return
  loading.value = true
  try {
    const res  = await fetch('/api/orders', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: form.value,
        cart: props.cart.map(i => ({ id: i.id, qty: i.qty })),
      }),
    })
    const json = await res.json()
    if (json.success) orderPlaced.value = true
    else alert(json.message || 'Something went wrong')
  } catch {
    alert('Network error — please try again')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-wrap { position: fixed; inset: 0; z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(0,0,0,0.5); }
.modal { background: var(--warm-white); border-radius: 20px; width: 100%; max-width: 520px; padding: 40px; max-height: 90vh; overflow-y: auto; }
.modal-title { font-family: var(--font-display); font-size: 32px; font-weight: 300; margin-bottom: 8px; }
.modal-sub { color: var(--mid); font-size: 14px; margin-bottom: 32px; }

.order-summary { background: var(--cream); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
.order-summary-title { font-size: 13px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--mid); margin-bottom: 12px; }
.order-line { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; }
.order-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 600; padding-top: 10px; border-top: 1px solid var(--border); margin-top: 8px; }

.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mid); font-weight: 500; margin-bottom: 6px; }
.form-input { width: 100%; padding: 12px 16px; border: 1px solid var(--border); border-radius: 10px; font-family: var(--font-body); font-size: 15px; background: white; color: var(--charcoal); outline: none; transition: border-color 0.2s; }
.form-input:focus { border-color: var(--sage); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.modal-actions { display: flex; gap: 12px; }
.btn-place { flex: 2; background: var(--sage); color: white; border: none; padding: 14px; border-radius: 40px; font-family: var(--font-body); font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
.btn-place:hover { background: var(--charcoal); }
.btn-place:disabled { opacity: 0.5; cursor: not-allowed; }

.success-wrap { text-align: center; padding: 20px 0; }
.success-icon  { font-size: 56px; margin-bottom: 16px; }
.success-title { font-family: var(--font-display); font-size: 32px; font-weight: 300; margin-bottom: 8px; }
.success-sub   { color: var(--mid); font-size: 15px; margin-bottom: 28px; }
</style>
