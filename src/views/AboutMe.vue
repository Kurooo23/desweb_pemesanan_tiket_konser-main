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
  <div class="pribadi-page">
    <header class="pribadi-page">
      <h1 class="Profile-topbar">CV Pembuat</h1>
        <button
          class="menu-button"
          aria-label="Open menu"
          :aria-expanded="sidebarOpen ? 'true' : 'false'"
          @click="toggleSidebar"
          >
          <span></span>
          <span></span>
          <span></span>
        </button>
    </header>


    <DrawerNav v-model="sidebarOpen">
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
    </DrawerNav>
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
  .cv-info {@apply min-h-screen flex flex-col bg-[#f7efcf] text-[#1f2933] font-sans;}

  @media (max-width: 640px) {
  .footer-row {
    /* Contact us di kiri, Balikpapan di kanan */
    @apply pl-4 pr-4
           flex-row justify-between items-start gap-6;
    }
  }
}

</style>

