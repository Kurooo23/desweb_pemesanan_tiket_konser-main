<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import DrawerNav from '@/components/DrawerNav.vue'

  const route = useRoute()
  const sidebarOpen = ref(false)
  const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)
  watch(() => route.fullPath, () => (sidebarOpen.value = false))
</script>

<template>
  <div class="contact-page">
    <!-- Drawer -->
    <DrawerNav v-model="sidebarOpen" />

    <!-- Tombol Hamburger (garis 3) -->
    <button
      class="menu-button"
      aria-label="Open menu"
      :aria-expanded="sidebarOpen ? 'true' : 'false'"
      @click="toggleSidebar"
    >
      <span></span><span></span><span></span>
    </button>

    <!-- HERO -->
    <section class="contact-hero">
      <div class="hero-inner">
        <h1>Contact Us</h1>
        <p>Let's Build Smarter Solutions Together</p>
      </div>
    </section>

    <!-- INFO & MAPS -->
    <section class="contact-info">
      <div class="info-grid">
        <div class="card map-card">
          <iframe
            title="Map to ITK Balikpapan"
            src="https://www.google.com/maps?q=Institut%20Teknologi%20Kalimantan%20Balikpapan&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div class="card info-card">
          <h2>Contact With Us</h2>
          <p class="tagline">Let's work together!</p>

          <ul class="info-list">
            <li>
              <span class="ico">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.6 10.8c1.7 3.2 3.9 5.4 7.1 7.1l2.4-2.4c.3-.3.8-.4 1.2-.3 1.3.4 2.7.7 4.1.8.5 0 .9.5.9 1v3.9c0 .5-.4 1-1 1C10.9 22 2 13.1 2 2.7 2 2.2 2.5 2 3 2h3.9c.5 0 1 .4 1 .9.1 1.4.4 2.8.8 4.1.1.4 0 .9-.3 1.2L6.6 10.8z"/>
                </svg>
              </span>
              <div>
                <div class="label">Have Any Question?</div>
                <a href="tel:+628115421487" class="value">+628115421487</a>
              </div>
            </li>

            <li>
              <span class="ico">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"/>
                </svg>
              </span>
              <div>
                <div class="label">Send Email</div>
                <a href="mailto:cs@asqitix.co.id" class="value">cs@asqitix.co.id</a>
              </div>
            </li>

            <li>
              <span class="ico">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5z"/>
                </svg>
              </span>
              <div>
                <div class="label">Office Address</div>
                <div class="value">
                  Jl. Soekarno Hatta Km.15, Balikpapan, Kalimantan Timur
                </div>
                <a
                  class="maps-link"
                  href="https://maps.google.com/?q=Institut+Teknologi+Kalimantan+Balikpapan"
                  target="_blank"
                  rel="noopener"
                >Open in Google Maps</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@reference "../assets/tailwind.css";
@layer components {
  .contact-page { @apply min-h-screen flex flex-col bg-[#f6f2e6]; }

  /* HERO */
  .contact-hero { background:#f5af3d; }
  .hero-inner { @apply max-w-5xl mx-auto text-center text-white py-16; }
  .hero-inner h1 { @apply text-3xl font-extrabold tracking-wide; }
  .hero-inner p  { @apply text-sm mt-2 opacity-90; }

  /* INFO + MAPS */
  .contact-info { @apply py-10; background: #f6f2e6; }
  .info-grid { @apply max-w-6xl mx-auto grid md:grid-cols-2 gap-6 px-4; }
  .card { @apply bg-white rounded-2xl shadow-lg overflow-hidden; }
  .map-card iframe { @apply w-full h-80 md:h-[360px] border-0; }
  .info-card { @apply p-6; }
  .info-card h2 { @apply text-xl font-bold text-gray-900; }
  .tagline { @apply text-xs text-orange-600 mb-4; }
  .info-list { @apply space-y-4; }
  .info-list li { @apply flex gap-4; }
  .ico { @apply shrink-0 w-10 h-10 rounded-full grid place-content-center bg-[#f7a930]/90 text-white; }
  .ico svg { @apply w-5 h-5 fill-white; }
  .label { @apply text-xs text-gray-500; }
  .value { @apply text-sm font-medium text-gray-900; }
  .maps-link { @apply mt-1 inline-block text-xs text-orange-600 hover:underline; }

  /* === Hamburger fixed di kanan atas === */
  .menu-button {
    @apply fixed top-4 right-4 w-9 h-7 flex flex-col justify-between border-0 bg-transparent cursor-pointer z-[100];
  }
  .menu-button span { @apply h-[3px] rounded-full bg-black/80; }
  /* Kontras saat di atas hero oranye */
  .contact-hero + .menu-button span { background: #f6f2e6; }
}
</style>
