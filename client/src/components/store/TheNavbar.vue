<template>
  <nav>
    <div class="nav-logo" @click="$emit('navigate', 'home')">AVAIL Jombang<span>.</span></div>
    <div class="nav-links">
      <button type="button" class="nav-link" :class="{ active: currentPage === 'home' }"     @click="$emit('navigate', 'home')">Home</button>
      <button type="button" class="nav-link" :class="{ active: currentPage === 'products' }" @click="$emit('navigate', 'products')">Produk</button>
      <button type="button" class="nav-link" :class="{ active: currentPage === 'testimonial' }" @click="$emit('navigate', 'testimonial')">Testimonial</button>
      <button type="button" class="cart-btn" @click="$emit('open-cart')">
        🛍️ Cart
        <span v-if="cartCount > 0" class="cart-count">{{ cartCount }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  cartCount:   { type: Number, default: 0 },
  currentPage: { type: String, default: 'home' },
})
defineEmits(['open-cart', 'navigate'])
</script>

<style scoped>
nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(249, 245, 240, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 0 40px; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
}
.nav-logo {
  font-family: var(--font-display); font-size: 26px; font-weight: 300;
  letter-spacing: 0.04em; color: var(--charcoal); cursor: pointer;
}
.nav-logo span { color: var(--sage); font-style: italic; }
.nav-links { display: flex; gap: 32px; align-items: center; }
.nav-link {
  font-size: 13px; font-weight: 400; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--mid); cursor: pointer;
  transition: color 0.2s; border: none; background: none;
}
.nav-link:hover, .nav-link.active { color: var(--charcoal); }
.cart-btn {
  display: flex; align-items: center; gap: 8px;
  background: var(--charcoal); color: white; border: none;
  padding: 9px 18px; border-radius: 40px;
  font-family: var(--font-body); font-size: 13px; font-weight: 500;
  cursor: pointer; transition: background 0.2s;
}
.cart-btn:hover { background: var(--sage); }
.cart-count {
  background: var(--earth); color: white; border-radius: 50%;
  width: 18px; height: 18px; font-size: 11px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
}
@media (max-width: 768px) { nav { padding: 0 20px; } }
</style>
