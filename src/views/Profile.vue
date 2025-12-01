<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import DrawerNav from '@/components/DrawerNav.vue'
import profileSvg from '@/assets/profile.svg'
import TicketModal from '@/components/TicketModal.vue'

import imgFeast from '@/assets/Feast_Foto.jpg'
import imgSO7 from '@/assets/SO7.jpeg'
import imgGigi from '@/assets/Band-Gigi-2018.jpg'

const STORAGE_KEY_BALANCE = 'asiqtix_wallet_balance'
const STORAGE_KEY_HISTORY = 'asiqtix_purchase_history'

const route = useRoute()
const sidebarOpen = ref(false)
const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)

watch(
  () => route.fullPath,
  () => (sidebarOpen.value = false),
)

const walletBalance = ref(8)
const walletAccount = ref('0x7z2...y52a')

const histories = ref([])

/* meta event, sama seperti di History.vue */
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

  // balance
  const savedBalance = window.localStorage.getItem(STORAGE_KEY_BALANCE)
  if (savedBalance !== null) {
    const n = Number(savedBalance)
    if (!Number.isNaN(n)) walletBalance.value = n
  }

  // history
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

/* tampilan saldo (biar nggak 508.4820000000000001) */
const displayBalance = computed(() => {
  const n = Number(walletBalance.value)
  if (!Number.isFinite(n)) return walletBalance.value

  const rounded = Math.round(n * 1000) / 1000 // 3 decimal
  return rounded.toLocaleString('id-ID', {
    minimumFractionDigits: rounded % 1 === 0 ? 0 : 3,
    maximumFractionDigits: 3,
  })
})

/* modal tiket */
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
  <div class="profile-page">
    <!-- TOP BAR: hanya title dan hamburger -->
    <header class="profile-topbar">
      <h1 class="profile-title">Profile</h1>

      <button
        type="button"
        class="profile-hamburger"
        aria-label="Toggle sidebar"
        @click="toggleSidebar"
      >
        <span />
        <span />
        <span />
      </button>
    </header>

    <!-- Side Nav -->
    <DrawerNav v-model="sidebarOpen" />

    <!-- MAIN CONTENT -->
    <main class="profile-main">
      <div class="profile-shell">
        <div class="top-row">
          <!-- AVATAR -->
          <aside class="profile-card">
            <div class="avatar-frame">
              <div class="avatar-inner">
                <img :src="profileSvg" alt="Profile avatar" class="avatar-img" />
              </div>
            </div>
          </aside>

          <!-- PURCHASE HISTORY -->
          <section class="history-card">
            <h2>Purchase History</h2>

            <div class="history-table">
              <div class="thead">
                <div>Concert(s)</div>
                <div>Payment Date</div>
                <div>Price</div>
                <div>Status</div>
                <div>Action</div>
              </div>

              <div v-if="histories.length" class="tbody">
                <div
                  v-for="row in histories"
                  :key="row.id"
                  class="trow"
                >
                  <div>{{ row.title }}</div>
                  <div>{{ row.date }}</div>
                  <div>{{ row.price }}</div>
                  <div>{{ row.status }}</div>
                  <div>
                    <button
                      class="detail-btn"
                      type="button"
                      @click="showTicket(row)"
                    >
                      SHOW TICKET
                    </button>
                  </div>
                </div>
              </div>

              <div v-else class="empty-history">
                No successful transactions yet.
              </div>
            </div>
          </section>
        </div>

        <!-- WALLET -->
        <section class="wallet-card">
          <h3>My Wallet</h3>
          <div class="wallet-amount">
            {{ displayBalance }}
            <span class="wallet-unit">POL</span>
          </div>
          <p class="wallet-account">
            account number: {{ walletAccount }}
          </p>

          <div class="wallet-actions" />
        </section>
      </div>
    </main>

    <!-- Modal tiket -->
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

/* PAGE + TOP BAR */
.profile-page {
  @apply min-h-screen flex flex-col bg-[#f7efcf] text-[#1f2933] font-sans;
}

.profile-topbar {
  @apply flex justify-between items-center px-10 py-5 bg-[#f7efcf];
}

.profile-title {
  @apply text-left text-[48px] font-bold text-[#f7a930];
}

.profile-hamburger {
  @apply w-9 h-[26px] flex flex-col justify-between border-none bg-transparent cursor-pointer;
}

.profile-hamburger span {
  @apply h-[3px] rounded-full bg-[#1f2933];
}

/* MAIN CONTENT */
.profile-main {
  @apply flex-1 w-full px-[60px] py-8 pb-[72px];
}

.profile-shell {
  @apply max-w-[1040px] mx-auto flex flex-col gap-8;
}

.top-row {
  @apply flex gap-10 items-start;
}

/* AVATAR CARD */
.profile-card {
  @apply w-[190px] h-[190px] rounded-xl bg-[#6b0a00] flex flex-col justify-center px-4 py-[18px];
}

.avatar-frame {
  @apply flex-1 flex items-center justify-center;
}

.avatar-inner {
  @apply w-[120px] h-[120px] rounded-3xl overflow-hidden bg-[#450600];
}

.avatar-img {
  @apply w-full h-full object-contain;
}

/* PURCHASE HISTORY CARD */
.history-card {
  @apply flex-1 rounded-lg bg-[#141c4a] px-8 pt-6 pb-7 text-gray-50;
}

.history-card h2 {
  @apply text-xl font-bold mb-[18px] text-[#f5c86b];
}

/* TABLE */
.history-table {
  @apply w-full text-xs;
}

.history-table .thead {
  @apply grid grid-cols-[2.4fr_1.3fr_1fr_1.2fr_0.9fr] gap-x-3 pb-2 border-b border-[#f5c86b] font-semibold;
}

.history-table .tbody {
  @apply mt-1;
}

.history-table .trow {
  @apply grid grid-cols-[2.4fr_1.3fr_1fr_1.2fr_0.9fr] gap-x-3 items-center py-1.5 border-b border-slate-50/22;
}

.history-table .trow:last-child {
  @apply border-b-0;
}

.detail-btn {
  @apply text-[10px] px-2.5 py-1 rounded-sm bg-[#f5c86b] text-gray-900 font-semibold border-none cursor-pointer;
}

.empty-history {
  @apply py-6 text-center text-xs text-slate-50/80;
}

/* MY WALLET CARD */
.wallet-card {
  @apply rounded-lg bg-[#6b0a00] px-8 pt-6 pb-[22px] text-[#fef3c7] max-w-[640px] ml-[230px];
}

.wallet-card h3 {
  @apply text-xl font-bold mb-3;
}

/* ukuran nominal sama seperti wallet.vue */
.wallet-amount {
  @apply text-[56px] font-bold my-2.5 mt-2.5 mb-5;
}

.wallet-unit {
  @apply text-[56px];
}

.wallet-account {
  @apply text-[11px] opacity-90;
}

.wallet-actions {
  @apply mt-2.5 flex justify-end;
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .profile-main {
    @apply px-5 py-6 pb-10;
  }
}

@media (max-width: 900px) {
  .top-row {
    @apply flex-col items-center;
  }

  .history-card {
    @apply w-full;
  }

  .wallet-card {
    @apply max-w-full ml-0;
  }
}

@media (max-width: 640px) {
  .profile-topbar {
    @apply px-4 py-3;
  }

  .profile-title {
    @apply text-xl;
  }

  .profile-main {
    @apply px-4;
  }
  .profile-card {
    @apply w-[95px] h-[95px] rounded-xl bg-[#6b0a00] flex flex-col justify-center px-4 py-2;
  }

  .avatar-inner {
    @apply w-[60px] h-[60px] rounded-xl overflow-hidden bg-[#450600];
  }

  .profile-hamburger {
    @apply justify-self-end w-7 h-[24px] flex flex-col justify-between bg-transparent border-none;
  }

  .profile-title {
    @apply text-left text-[32px] font-bold text-[#f7a930];
  }

  .wallet-amount {
    @apply text-[32px] font-bold my-2.5 mt-2.5 mb-5;
  }

  .wallet-unit {
    @apply text-[32px];
  }

}
</style>
