<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DrawerNav from '@/components/DrawerNav.vue'
import TicketModal from '@/components/TicketModal.vue'

import imgFeast from '@/assets/Feast_Foto.jpg'
import imgSO7 from '@/assets/SO7.jpeg'
import imgGigi from '@/assets/Band-Gigi-2018.jpg'

const STORAGE_KEY_HISTORY = 'asiqtix_purchase_history'

const route = useRoute()
const sidebarOpen = ref(false)
const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)
watch(() => route.fullPath, () => (sidebarOpen.value = false))

const histories = ref([])

/* “Database” event, samakan dengan HomeView / EventTicketView */
const EVENT_META = {
  FEAST: {
    title: 'FEAST',
    image: imgFeast,
    place: 'Dome, Balikpapan',
    datetime: 'Saturday, 10/10/25 - 19:30',
  },
  'SHEILA ON 7': {
    title: 'SHEILA ON 7',
    image: imgSO7,
    place: 'Kotaraya Hall, Yogyakarta',
    datetime: 'Sunday, 10/11/25 - 19:30',
  },
  GIGI: {
    title: 'GIGI',
    image: imgGigi,
    place: 'Kebun Raya, Bogor',
    datetime: 'Thursday, 20/11/25 - 20:00',
  },
}

onMounted(() => {
  if (typeof window === 'undefined') return
  const raw = window.localStorage.getItem(STORAGE_KEY_HISTORY)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      histories.value = parsed.filter((h) => h.status === 'Successful')
    }
  } catch (e) {
    console.error('Failed to parse purchase history', e)
  }
})

/* MODAL TIKET */
const showTicketModal = ref(false)
const ticketPayload = ref({
  title: '',
  booking: '',
  place: '',
  datetime: '',
  image: '',
})

function showTicket(row) {
  const meta = EVENT_META[row.title] || {}
  ticketPayload.value = {
    title: meta.title || row.title,
    booking: row.booking,
    place: meta.place || 'Unknown place',
    datetime: meta.datetime || row.date,
    image: meta.image || imgFeast,
  }
  showTicketModal.value = true
}
</script>

<template>
  <div class="history-page">
    <!-- TOP BAR -->
    <header class="history-topbar">
      <div class="history-logo-wrap">
        <img src="/logo_with_text.png" alt="AsiqTIX" class="history-logo" />
      </div>
      <h1 class="history-title">Purchase History</h1>
      <button
        class="history-hamburger"
        aria-label="Toggle menu"
        @click="toggleSidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>

    <!-- Side Nav -->
    <DrawerNav v-model="sidebarOpen" />

    <!-- MAIN WRAPPER -->
    <main class="history-main">
      <section class="history-section">
        <h2 class="history-section-title">Concert(s)</h2>

        <ul class="history-list" role="list">
          <li
            v-for="row in histories"
            :key="row.id"
            class="history-item"
          >
            <div class="history-item-header">
              <h3 class="history-event">{{ row.title }}</h3>
              <button class="history-btn" @click="showTicket(row)">
                SHOW TICKET
              </button>
            </div>

            <div class="history-meta">
              <p><span class="meta-label">DATE:</span> {{ row.date }}</p>
              <p>
                <span class="meta-label">BOOKING ID:</span>
                {{ row.booking }}
              </p>
              <p><span class="meta-label">PRICE:</span> {{ row.price }}</p>
              <p><span class="meta-label">STATUS:</span> {{ row.status }}</p>
            </div>
          </li>

          <li v-if="!histories.length" class="history-item">
            <div class="history-meta">
              <p>No successful transactions yet.</p>
            </div>
          </li>
        </ul>
      </section>
    </main>

    <!-- MODAL TIKET -->
    <TicketModal
      v-if="showTicketModal"
      v-model="showTicketModal"
      :title="ticketPayload.title"
      :booking="ticketPayload.booking"
      :place="ticketPayload.place"
      :datetime="ticketPayload.datetime"
      :image="ticketPayload.image"
    />
  </div>
</template>

<style scoped>
@reference "../assets/tailwind.css";
@layer components {
  .history-page { @apply min-h-screen flex flex-col bg-[#1e2342] text-slate-50 font-sans; }
  .history-topbar { @apply grid grid-cols-[auto_1fr_auto] items-center gap-4 px-10 py-4 bg-black; }
  .history-logo-wrap { @apply flex items-center; }
  .history-logo { @apply h-10 object-contain; }
  .history-title { @apply text-left text-[22px] font-bold text-[#f7a930]; }
  .history-hamburger { @apply w-9 h-[26px] flex flex-col justify-between border-none bg-transparent cursor-pointer; }
  .history-hamburger span { @apply h-[3px] rounded-full bg-[#f6f2e6]; }

  .history-main { @apply flex-1 px-[60px] py-8 pb-10; }
  .history-section { @apply max-w-[1100px] mx-auto; }
  .history-section-title { @apply text-2xl mb-6; }

  .history-list { @apply list-none p-0 m-0; }
  .history-item { @apply pt-[18px] pb-5 border-t-2 border-[#f7a930]; }
  .history-item:last-child { @apply border-b-2 border-[#f7a930]; }
  .history-item-header { @apply flex items-center justify-between gap-4 mb-2; }
  .history-event { @apply text-lg font-semibold; }

  .history-meta { @apply text-[13px] leading-relaxed; }
  .history-meta p { @apply m-0; }
  .meta-label { @apply font-bold; }

  .history-btn { @apply px-[18px] py-1.5 text-[11px] font-bold rounded border-none cursor-pointer bg-[#f6f2e6] text-gray-900; }

  @media (max-width: 960px) {
    .history-main { @apply px-5 py-6 pb-8; }
  }
  @media (max-width: 640px) {
    .history-topbar { @apply grid-cols-[auto_auto_auto] px-4 py-3; }
    .history-title { @apply text-lg; }
    .history-item-header { @apply flex-col items-start; }
    .history-btn { @apply self-start; }
  }
}
</style>
