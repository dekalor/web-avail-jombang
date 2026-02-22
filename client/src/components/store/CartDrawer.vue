<template>
  <div class="overlay" @click="$emit('close')"></div>
  <div class="cart-drawer">
    <div class="drawer-header">
      <div class="drawer-title">Your cart</div>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="drawer-items">
      <div v-if="cart.length === 0" class="empty-cart">
        <div class="empty-icon">🛍️</div>
        <p>Your cart is empty</p>
      </div>
      <div v-else class="cart-item" v-for="item in cart" :key="item.id">
        <div class="cart-item-icon" :style="{ background: 'white' }">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="cart-item-image" />
          <span v-else class="cart-item-placeholder">IMG</span>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">{{ item.name }}</div>
          <div class="cart-item-price">Rp {{ (item.price * item.qty).toLocaleString('id-ID') }}</div>
          <div class="qty-control">
            <button class="qty-btn" @click="$emit('change-qty', item, -1)">−</button>
            <span class="qty-num">{{ item.qty }}</span>
            <button class="qty-btn" @click="$emit('change-qty', item, 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" @click="$emit('remove-item', item.id)">🗑️</button>
      </div>
    </div>

    <div v-if="cart.length > 0" class="drawer-footer">
      <div class="subtotal-row"><span>Subtotal</span><span>Rp {{ cartTotal.toLocaleString('id-ID') }}</span></div>
      <div class="subtotal-row"><span>Shipping</span><span>{{ shippingFee === 0 ? 'Free' : 'Rp 15.000' }}</span></div>
      <div class="total-row">
        <span>Total</span>
        <span>Rp {{ grandTotal.toLocaleString('id-ID') }}</span>
      </div>
      <button class="checkout-btn" @click="$emit('checkout')">Proceed to checkout →</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cart:        { type: Array,  default: () => [] },
  cartTotal:   { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  grandTotal:  { type: Number, default: 0 },
})
defineEmits(['close', 'change-qty', 'remove-item', 'checkout'])
</script>

<style scoped>
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200; animation: fadeIn 0.25s forwards; opacity: 0; }
@keyframes fadeIn { to { opacity: 1; } }

.cart-drawer { position: fixed; top: 0; right: 0; bottom: 0; width: 420px; background: var(--warm-white); z-index: 201; display: flex; flex-direction: column; transform: translateX(100%); animation: slideIn 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
@keyframes slideIn { to { transform: translateX(0); } }

.drawer-header { padding: 28px 28px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.drawer-title { font-family: var(--font-display); font-size: 26px; font-weight: 300; }
.close-btn { background: none; border: none; font-size: 22px; cursor: pointer; color: var(--mid); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s; }
.close-btn:hover { background: var(--border); }

.drawer-items { flex: 1; overflow-y: auto; padding: 20px 28px; }
.empty-cart { text-align: center; padding: 60px 20px; color: var(--mid); }
.empty-icon { font-size: 48px; margin-bottom: 12px; }

.cart-item { display: flex; gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--border); align-items: center; }
.cart-item-icon { width: 56px; height: 56px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
.cart-item-image { width: 100%; height: 100%; object-fit: cover; }
.cart-item-placeholder {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--mid);
}
.cart-item-info { flex: 1; }
.cart-item-name { font-weight: 500; font-size: 14px; margin-bottom: 2px; }
.cart-item-price { font-size: 13px; color: var(--mid); }
.qty-control { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.qty-btn { background: var(--border); border: none; width: 26px; height: 26px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.qty-btn:hover { background: var(--sage-light); }
.qty-num { font-size: 14px; font-weight: 500; min-width: 16px; text-align: center; }
.remove-btn { background: none; border: none; color: var(--mid); cursor: pointer; font-size: 16px; transition: color 0.2s; }
.remove-btn:hover { color: #c0392b; }

.drawer-footer { padding: 20px 28px 28px; border-top: 1px solid var(--border); }
.subtotal-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--mid); margin-bottom: 8px; }
.total-row { display: flex; justify-content: space-between; font-size: 20px; font-weight: 500; margin-bottom: 20px; padding-top: 12px; border-top: 1px solid var(--border); }
.checkout-btn { width: 100%; background: var(--charcoal); color: white; border: none; padding: 15px; border-radius: 40px; font-family: var(--font-body); font-size: 15px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
.checkout-btn:hover { background: var(--sage); }

@media (max-width: 768px) { .cart-drawer { width: 100%; } }
</style>
