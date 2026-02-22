<template>
  <footer class="bg-[#2C4A2F] text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid md:grid-cols-3 gap-8">
        <!-- Brand & Address -->
        <div>
          <h3 class="text-2xl font-bold mb-4">AVAIL</h3>
          <p class="text-lg text-white/80 mb-4">
            Produk Herbal Alami Terpercaya
          </p>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <MapPin class="w-6 h-6 flex-shrink-0 mt-1 text-[#7BA87D]" />
              <p class="text-lg text-white/80">
                Jl. Kesehatan No. 123<br />
                Jakarta Selatan, DKI Jakarta 12345
              </p>
            </div>
            <div class="flex items-center gap-3">
              <Phone class="w-6 h-6 flex-shrink-0 text-[#7BA87D]" />
              <p class="text-lg text-white/80">+62 812-3456-7890</p>
            </div>
            <div class="flex items-center gap-3">
              <Mail class="w-6 h-6 flex-shrink-0 text-[#7BA87D]" />
              <p class="text-lg text-white/80">info@avail.co.id</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div>
          <h3 class="text-xl font-bold mb-4">Menu</h3>
          <ul class="space-y-3">
            <li>
              <Link to="/" class="text-lg text-white/80 hover:text-white transition-colors">
              Home
              </Link>
            </li>
            <li>
              <Link to="/products" class="text-lg text-white/80 hover:text-white transition-colors">
              Produk
              </Link>
            </li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 class="text-xl font-bold mb-4">Informasi</h3>
          <p class="text-lg text-white/80 leading-relaxed">
            AVAIL adalah produk herbal alami yang diformulasikan khusus
            untuk membantu menjaga kesehatan Anda dan keluarga.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div class="border-t border-white/20 mt-10 pt-8 text-center">
        <p class="text-lg text-white/60">
          &copy; {new Date().getFullYear()} AVAIL. Semua hak cipta dilindungi.
        </p>
      </div>
    </div>
  </footer>
</template>

<!-- <template>
  <footer>
    <strong>AVAIL Jombang.</strong> — Bio Sanitary Pads · Gentle on you, kind to the earth · © 2025
  </footer>
</template>

<style scoped>
footer {
  background: var(--charcoal);
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 32px 40px;
  font-size: 13px;
}
footer strong { color: white; }
</style> -->
