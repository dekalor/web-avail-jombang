<template>
  <div class="product-card" @click="$emit('click')">
    <div class="product-img" :style="{ background: 'white' }">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="product-image"
      />
      <div v-else class="product-image-placeholder">No image</div>
      <span v-if="product.badge" class="product-badge">{{ product.badge }}</span>
    </div>
    <div class="product-body">
      <div class="product-name">{{ product.name }}</div>
      <div class="product-desc">{{ product.description }}</div>
      <div class="product-footer">
        <div class="product-price">
          Rp {{ product.price.toLocaleString('id-ID') }} <span>/pack</span>
        </div>
        <button class="add-btn" @click.stop="$emit('add-to-cart', product)">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true },
})
defineEmits(['add-to-cart', 'click'])
</script>

<style scoped>
.product-card {
  background: var(--warm-white); border-radius: 16px;
  overflow: hidden; border: 1px solid var(--border);
  transition: transform 0.25s, box-shadow 0.25s; cursor: pointer;
}
.product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }

.product-img {
  height: 220px; display: flex; align-items: center; justify-content: center;
  font-size: 64px; position: relative; overflow: hidden;
}
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--mid);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.product-badge {
  position: absolute; top: 14px; left: 14px;
  background: var(--sage); color: white;
  font-size: 11px; font-weight: 500; padding: 4px 10px;
  border-radius: 20px; letter-spacing: 0.04em;
}
.product-body  { padding: 20px 24px 24px; }
.product-name  { font-family: var(--font-display); font-size: 20px; font-weight: 400; margin-bottom: 4px; }
.product-desc  { font-size: 13px; color: var(--mid); line-height: 1.5; margin-bottom: 16px; }
.product-footer { display: flex; align-items: center; justify-content: space-between; }
.product-price { font-size: 20px; font-weight: 500; color: var(--charcoal); }
.product-price span { font-size: 13px; color: var(--mid); font-weight: 400; }
.add-btn {
  background: var(--charcoal); color: white; border: none;
  width: 38px; height: 38px; border-radius: 50%; font-size: 20px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, transform 0.15s;
}
.add-btn:hover { background: var(--sage); transform: scale(1.1); }
</style>
