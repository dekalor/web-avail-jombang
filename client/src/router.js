// src/router.js
import { createRouter, createWebHistory } from 'vue-router'
import Layout from './components/Layout.vue'

const SITE_NAME = 'AVAIL Jombang'
const DEFAULT_TITLE = `${SITE_NAME} | Produk Herbal Alami`
const DEFAULT_DESCRIPTION = 'AVAIL Jombang menyediakan produk herbal alami untuk kesehatan keluarga Indonesia.'

function upsertMetaTag(name, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('./pages/HomePage.vue'),
        meta: {
          title: `${SITE_NAME} | Sehat Alami untuk Anda`,
          description: 'Temukan produk AVAIL terbaik, tips kesehatan, dan solusi herbal alami terpercaya di AVAIL Jombang.',
          robots: 'index,follow',
        },
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('./pages/ProductsPage.vue'),
        meta: {
          title: `Produk AVAIL | ${SITE_NAME}`,
          description: 'Lihat katalog lengkap produk AVAIL dengan pilihan unit, harga, dan manfaat untuk kebutuhan Anda.',
          robots: 'index,follow',
        },
      },
      {
        path: 'testimonials',
        name: 'Testimonials',
        component: () => import('./pages/TestimonialPage.vue'),
        meta: {
          title: `Testimoni Pelanggan | ${SITE_NAME}`,
          description: 'Baca pengalaman nyata pelanggan AVAIL dan lihat hasil penggunaan produk herbal AVAIL.',
          robots: 'index,follow',
        },
      },
      {
        path: 'products/:id',
        name: 'ProductDetail',
        component: () => import('./pages/ProductDetailPage.vue'),
        meta: {
          title: `Detail Produk | ${SITE_NAME}`,
          description: 'Informasi lengkap produk AVAIL: manfaat, variasi unit, harga, dan cara pemesanan.',
          robots: 'index,follow',
        },
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('./pages/CartPage.vue'),
        meta: {
          title: `Keranjang Belanja | ${SITE_NAME}`,
          description: 'Periksa produk pilihan Anda sebelum melanjutkan ke checkout.',
          robots: 'noindex,nofollow',
        },
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('./pages/CheckoutPage.vue'),
        meta: {
          title: `Checkout | ${SITE_NAME}`,
          description: 'Lengkapi data pengiriman dan pembayaran untuk menyelesaikan pesanan Anda.',
          robots: 'noindex,nofollow',
        },
      },
      {
        path: 'order-success',
        name: 'Order Success',
        component: () => import('./pages/OrderSuccess.vue'),
        meta: {
          title: `Pesanan Berhasil | ${SITE_NAME}`,
          description: 'Pesanan berhasil dibuat. Simpan detail pesanan Anda untuk referensi.',
          robots: 'noindex,nofollow',
        },
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0, behavior: 'auto' }
  },
})

router.afterEach((to) => {
  const title = to.meta?.title || DEFAULT_TITLE
  const description = to.meta?.description || DEFAULT_DESCRIPTION
  const robots = to.meta?.robots || 'index,follow'
  const canonicalUrl = `${window.location.origin}${to.fullPath}`

  document.title = title
  upsertMetaTag('description', description)
  upsertMetaTag('robots', robots)
  upsertCanonical(canonicalUrl)
})

export default router
