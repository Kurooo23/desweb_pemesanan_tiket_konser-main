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
    <header class="pribadi-header">
      <h1 class="profile-topbar">CV Pembuat</h1>
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
      </section>
    </DrawerNav>
  </div>
</template>

<style scoped>
  @reference "../assets/tailwind.css";

  .pribadi-page { @apply min-h-screen flex flex-col bg-[#f6f2e6]; }
  .pribadi-header { @apply sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white shadow; }

  h1 { @apply text-gray-800 text-2xl font-bold; }

  .menu-button { @apply w-8 h-6 flex flex-col justify-between bg-transparent border-none cursor-pointer; }
  .menu-button span { @apply h-0.5 bg-gray-800 rounded; }

  .cv-info { @apply flex flex-col bg-[#f7efcf] text-[#1f2933] font-sans p-6; }

  .info-grid { @apply mb-8; }
  .info-grid h2 { @apply text-2xl font-bold mb-2; }
  .info-grid h3 { @apply text-lg text-gray-600 mb-4; }
  .info-grid p { @apply text-gray-700 leading-relaxed; }

  /* Grid untuk foto */
  .cards-foto { @apply mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6; }
  .cards-foto-edited { @apply flex justify-center; }
  .foto { @apply w-40 h-auto rounded-lg shadow object-cover; }
</style>
