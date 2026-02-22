<template>
  <div class="page-section">
    <div class="section-header">
      <p class="section-eyebrow">Customer stories</p>
      <h2 class="section-title">What they say about Avail</h2>
    </div>

    <div class="testimonials-grid">
      <article class="card" v-for="item in testimonials" :key="item.name">
        <p class="quote">"{{ item.quote }}"</p>
        <div class="meta">
          <p class="name">{{ item.name }}</p>
          <p class="city">{{ item.city }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
const testimonials = [
  {
    name: 'Nadia A.',
    city: 'Jombang',
    quote: 'Very comfy and breathable. I can wear it all day and still feel fresh.',
  },
  {
    name: 'Shinta P.',
    city: 'Surabaya',
    quote: 'I switched to Avail because it is gentler on my skin and eco-friendly too.',
  },
  {
    name: 'Mira K.',
    city: 'Malang',
    quote: 'The absorption is great, and the quality feels premium for the price.',
  },
]
</script>

<style scoped>
.page-section { max-width: 1200px; margin: 0 auto; padding: 60px 40px; }
.section-header { margin-bottom: 48px; }
.section-eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--sage); font-weight: 500; margin-bottom: 8px; }
.section-title { font-family: var(--font-display); font-size: 40px; font-weight: 300; }

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  background: var(--warm-white);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}

.quote {
  font-size: 15px;
  line-height: 1.7;
  color: var(--charcoal);
  margin-bottom: 24px;
}

.meta { border-top: 1px solid var(--border); padding-top: 14px; }
.name { font-weight: 600; color: var(--charcoal); }
.city { font-size: 13px; color: var(--mid); }

@media (max-width: 768px) { .page-section { padding: 40px 20px; } }
</style>
