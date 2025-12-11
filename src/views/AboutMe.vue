<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import DrawerNav from '@/components/DrawerNav.vue'

  const route = useRoute()
  const sidebarOpen = ref(false)
  const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)
  watch(() => route.fullPath, () => (sidebarOpen.value = false))
</script>

<template>
  <div class="pribadi-page"
    <header class="cv-me-topbar">
        <button
        class="menu-button"
        aria-label="Open menu"
        :aria-expanded="sidebarOpen ? 'true' : 'false'"
        @click="toggleSidebar"
        >
        <span></span><span></span><span></span>
      </button>
    <!-- Drawer -->
      <DrawerNav v-model="sidebarOpen">

      <!-- HERO -->
        <section class="contact-hero">
          <div class="hero-inner">
            <h1>CV Pembuat</h1>
          </div>
        </section>
    </header>

    <section class="cv-info">
      <div class="info-grid">
        <h2>Bagas Yoga Pratama Pramudika</h2>
        <h3>11231014 - Informatika - Institut Teknologi Kalimantan</h3>
        <p>Seorang mahasiswa Informatika Institut Teknologi Kalimantan Tahun ke-3 yang memiliki hobi bermain game, tidur, dan mencari makanan yang underrated</p>
      </div>

      <section class="cards-foto">
        <div class="cards-foto-edited">
          <div class="foto">
            <img src="/Pas Foto_11231014_Bagas Yoga Pratama Pramudika.jpg" alt="foto" class="foto">
          </div>
        </div>
      </section>

      <section>

      </section>
    </section>
  </div>
</template>
<style scoped>
  @reference '../assets/taiilwind.css'
  @layer components{
  .cv-me-topbar { @apply min-h-screen flex flex-col bg-[#f6f2e6]; }
  .about-topbar {  @apply sticky top-0 z-50; }
  h1 {
  @apply text-gray-800 mb-2 text-[2rem];
  }
  .cards-foto { @apply absolute right-0  text-xl font-bold leading-none text-black cursor-pointer }

  @media (max-width: 640px) {
  .footer-row {
    /* Contact us di kiri, Balikpapan di kanan */
    @apply pl-4 pr-4
           flex-row justify-between items-start gap-6;
  }
}

</style>

