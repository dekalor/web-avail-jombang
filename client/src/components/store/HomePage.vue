<template>
  <section class="hero">
    <div class="hero-left">
      <p class="hero-eyebrow">100% Kapas · Kandungan Bahan Alami</p>
      <h1 class="hero-title">AVAIL - Pembalut Kapas Herbal</h1>
      <p class="hero-desc">
        <em>AVAIL BIO Sanitary Pad</em> merupakan pilihan terbaik untuk pembalut wanita. <em>AVAIL</em> dibuat dari kapas yang mengandung
        herbal dan antiseptik alami, bebas dari bahan-bahan kimia berbahaya.
      </p>
      <div class="hero-actions">
        <button class="btn-primary" @click="$emit('navigate', 'products')">Shop now →</button>
        <button class="btn-secondary">Learn more</button>
      </div>
    </div>
    <div class="hero-right">
      <div class="hero-bg-pattern"></div>
      <div class="hero-visual">
        <div class="hero-icon-wrap"></div>
        <div class="hero-badge">✨ Certified Organic</div>
      </div>
    </div>
  </section>

  <div class="features-strip">
    <div class="feature-item"><span class="feature-icon">🌱</span> Kandungan Bahan Alami</div>
    <div class="feature-item"><span class="feature-icon">🧴</span> Bebas dari Bahan Kimia dan Pengharum</div>
    <div class="feature-item"><span class="feature-icon">☁🌿</span> 100% Kapas</div>
    <div class="feature-item"><span class="feature-icon">🩹</span> Pelopor Pembalut Halal</div>
  </div>

  <div class="page-section">
    <div class="section-header">
      <p class="section-eyebrow">Our bestsellers</p>
      <h2 class="section-title">Made to feel good</h2>
    </div>
    <div class="products-grid">
      <ProductCard
        v-for="p in products.slice(0, 3)"
        :key="p.id"
        :product="p"
        @add-to-cart="$emit('add-to-cart', $event)"
        @click="$emit('navigate', 'products')"
      />
    </div>
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'
defineProps({ products: { type: Array, default: () => [] } })
defineEmits(['navigate', 'add-to-cart'])
</script>

<style scoped>
.hero {
  min-height: calc(100vh - 64px);
  display: grid; grid-template-columns: 1fr 1fr; overflow: hidden;
}
.hero-left {
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px 60px 80px 80px; gap: 32px;
}
.hero-eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--sage); font-weight: 500; }
.hero-title { font-family: var(--font-display); font-size: clamp(52px, 5vw, 72px); font-weight: 300; line-height: 1.1; }
.hero-title em { font-style: italic; color: var(--sage); }
.hero-desc { font-size: 16px; color: var(--mid); max-width: 380px; line-height: 1.7; font-weight: 300; }
.hero-actions { display: flex; gap: 16px; align-items: center; }
.btn-secondary { background: none; border: none; font-family: var(--font-body); font-size: 14px; color: var(--mid); cursor: pointer; transition: color 0.2s; }
.btn-secondary:hover { color: var(--charcoal); }
.hero-right { background: var(--sage-light); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.hero-bg-pattern { position: absolute; inset: 0; opacity: 0.15; background-image: radial-gradient(circle at 30% 70%, var(--sage) 0%, transparent 60%), radial-gradient(circle at 70% 30%, var(--earth-light) 0%, transparent 60%); }
.hero-visual { position: relative; z-index: 1; text-align: center; }
.hero-icon-wrap { width: 180px; height: 180px; background: white; border-radius: 50%; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
.hero-icon { font-size: 72px; }
.hero-badge { background: white; border-radius: 40px; padding: 10px 22px; font-size: 13px; font-weight: 500; color: var(--sage); display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

.features-strip { background: var(--charcoal); color: white; display: flex; justify-content: center; gap: 60px; padding: 28px 40px; flex-wrap: wrap; }
.feature-item { display: flex; align-items: center; gap: 12px; font-size: 13px; letter-spacing: 0.04em; }
.feature-icon { font-size: 20px; }

.page-section { max-width: 1200px; margin: 0 auto; padding: 60px 40px; }
.section-header { margin-bottom: 48px; }
.section-eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--sage); font-weight: 500; margin-bottom: 8px; }
.section-title { font-family: var(--font-display); font-size: 40px; font-weight: 300; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px; }

@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-right { display: none; }
  .hero-left { padding: 60px 28px; }
  .features-strip { gap: 24px; padding: 20px; }
  .page-section { padding: 40px 20px; }
}
</style>
