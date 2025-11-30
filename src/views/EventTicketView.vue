<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DrawerNav from '@/components/DrawerNav.vue'
import ConfirmTransactionModal from '@/components/ConfirmTransactionModal.vue'
import PaymentStatusModal from '@/components/PaymentStatusModal.vue'

import bg from '@/assets/home_background.png'
import imgFeast from '@/assets/Feast_Foto.jpg'
import imgSO7 from '@/assets/SO7.jpeg'
import imgGigi from '@/assets/Band-Gigi-2018.jpg'

const STORAGE_KEY_BALANCE = 'asiqtix_wallet_balance'
const STORAGE_KEY_TX = 'asiqtix_wallet_transactions'
const STORAGE_KEY_HISTORY = 'asiqtix_purchase_history'

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)

const EVENTS = {
  feast: {
    title: 'FEAST',
    img: imgFeast,
    location: 'Dome, Balikpapan',
    date: '10/10/25',
    price: 50,
    paragraphs: [
      'Experience the heartfelt performance of Feast live at Stadion Sualman, Balikpapan, where their soulful lyrics and electrifying energy come alive on stage.',
      'Get ready for a night filled with emotion, passion, and music that speaks to every heart.',
      "Don't miss this unforgettable concert experience – join thousands of fans and feel the power of live music like never before.",
    ],
  },
  so7: {
    title: 'SHEILA ON 7',
    img: imgSO7,
    location: 'Kotaraya Hall, Yogyakarta',
    date: '10/11/25',
    price: 65,
    paragraphs: [
      'Sing your heart out with Sheila On 7 live at Kotaraya Stadium, Yogyakarta, as they take you on a nostalgic journey through the songs that have defined generations.',
      'Experience the magic of their timeless hits, the energy of the crowd, and the warmth of melodies that never fade.',
      'Let the rhythm move you and the lyrics bring back memories of simpler times. This is more than just a concert – it is a celebration of music, memories, and the enduring connection between Sheila On 7 and their fans.',
    ],
  },
  gigi: {
    title: 'GIGI',
    img: imgGigi,
    location: 'Kebun Raya, Bogor',
    date: '20/11/25',
    price: 57,
    paragraphs: [
      'Rock the night with GIGI live at Kebun Raya Bogor, as they light up the stage with their legendary hits and electrifying energy.',
      'Get ready for an unforgettable evening surrounded by nature, music, and the timeless sound of one of Indonesia’s most iconic bands.',
      'This is the perfect chance to sing along, jump, and celebrate decades of rock anthems together with thousands of fans.',
    ],
  },
}

const data = computed(() => {
  const slug = String(route.params.slug || '').toLowerCase()
  return EVENTS[slug] || EVENTS.feast
})

function goBack() {
  router.push({ name: 'home' })
}

/* ---------- Modal Konfirmasi ---------- */
const showConfirm = ref(false)
const contractFee = ref(5)      // POL
const gasFee = ref(0.006)       // POL

function openConfirm() {
  showConfirm.value = true
}

/* ---------- Modal Status Pembayaran ---------- */
const showStatus = ref(false)
const statusTitle = ref('')
const statusMessage = ref('')

function setStatus(success) {
  if (success) {
    statusTitle.value = 'Success!'
    statusMessage.value = 'The payment has been successfully completed'
  } else {
    statusTitle.value = 'Payment Failed'
    statusMessage.value =
      'Your wallet balance is lower than the total price of this ticket.'
  }
  showStatus.value = true
}

/* ---------- Handler saat CONFIRM di modal ---------- */
function handleConfirm(payload) {
  const totalPol = Number(payload.total) || 0
  if (totalPol <= 0) {
    setStatus(false)
    return
  }

  if (typeof window === 'undefined') {
    setStatus(false)
    return
  }

  // 1. cek saldo wallet
  const rawBalance = window.localStorage.getItem(STORAGE_KEY_BALANCE)
  let balance = rawBalance ? Number(rawBalance) : 0
  if (Number.isNaN(balance)) balance = 0

  if (balance < totalPol) {
    // saldo kurang
    setStatus(false)
    return
  }

  // 2. kurangi saldo
  const newBalance = balance - totalPol
  window.localStorage.setItem(STORAGE_KEY_BALANCE, String(newBalance))

  // 3. catat transaksi ke daftar transaksi wallet (untuk halaman wallet.vue)
  const today = new Date().toLocaleDateString('id-ID')
  let txList = []
  const rawTx = window.localStorage.getItem(STORAGE_KEY_TX)
  if (rawTx) {
    try {
      const parsed = JSON.parse(rawTx)
      if (Array.isArray(parsed)) txList = parsed
    } catch (e) {
      console.error('Failed to parse wallet transactions', e)
    }
  }
  txList.unshift({
    id: Date.now(),
    amount: totalPol,
    date: today,
    type: 'purchase',
  })
  window.localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(txList))

  // 4. catat ke purchase history (untuk history.vue)
  let histories = []
  const rawHist = window.localStorage.getItem(STORAGE_KEY_HISTORY)
  if (rawHist) {
    try {
      const parsed = JSON.parse(rawHist)
      if (Array.isArray(parsed)) histories = parsed
    } catch (e) {
      console.error('Failed to parse purchase history', e)
    }
  }

  histories.unshift({
    id: Date.now().toString(),
    title: data.value.title,
    date: data.value.date,
    booking: payload.address, 
    price: `${totalPol} POL`,
    status: 'Successful',
  })

  window.localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(histories))

  // 5. tampilkan status sukses
  setStatus(true, totalPol)
}

function handleCancel() {
  // tidak perlu apa-apa sekarang
}
</script>

<template>
  <div class="ticket-page">
    <!-- TOP BAR -->
    <header class="ticket-topbar">
      <div class="left-wrap">
        <button class="back-btn" type="button" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">Back</span>
        </button>

        <div class="logo-wrap">
          <img src="/logo_with_text.png" alt="AsiqTIX" class="logo" />
        </div>
      </div>

      <h1 class="title">Ticket</h1>

      <button
        class="hamburger"
        aria-label="Toggle menu"
        @click="sidebarOpen = !sidebarOpen"
      >
        <span></span><span></span><span></span>
      </button>
    </header>

    <DrawerNav v-model="sidebarOpen" />

    <!-- MAIN CONTENT -->
    <main class="ticket-main" :style="{ backgroundImage: `url(${bg})` }">
      <section class="ticket-panel">
        <!-- LEFT: IMAGE -->
        <div class="ticket-left">
          <div class="img-frame">
            <img :src="data.img" :alt="data.title" />
          </div>
        </div>

        <!-- RIGHT: TEXT -->
        <div class="ticket-right">
          <h2 class="event-title">{{ data.title }}</h2>

          <p class="meta">
            <span class="label">Location:</span> {{ data.location }}
          </p>
          <p class="meta">
            <span class="label">Date:</span> {{ data.date }}
          </p>

          <div class="paragraphs">
            <p v-for="(p, i) in data.paragraphs" :key="i">
              {{ p }}
            </p>
          </div>

          <!-- Blok price + button -->
          <div class="price-block">
            <div class="price-row">
              <div class="price-label">Price</div>
              <div class="price-value">{{ data.price }} POL</div>
            </div>

            <button class="btn-buy" @click="openConfirm">BUY TICKET</button>
          </div>
        </div>
      </section>
    </main>

    <!-- MODAL KONFIRMASI -->
    <ConfirmTransactionModal
      v-model="showConfirm"
      :amount="data.price"
      :contract-fee="contractFee"
      :gas-fee="gasFee"
      token-symbol="POL"
      network="Polygon Mainnet"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- MODAL STATUS (SUCCESS / FAILED) -->
    <PaymentStatusModal
      v-model="showStatus"
      :title="statusTitle"
      :message="statusMessage"
    />
  </div>
</template>

<style scoped>
@reference "../assets/tailwind.css";
.ticket-page {
  @apply min-h-screen flex flex-col bg-black text-[#f4f1de] font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif];
}

/* TOP BAR */
.ticket-topbar {
  @apply grid grid-cols-[auto_1fr_auto] items-center px-10 py-4 bg-black;
}

.left-wrap {
  @apply flex items-center gap-3;
}

.back-btn {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-50/35 bg-transparent text-[#f6f2e6] text-xs font-semibold cursor-pointer hover:bg-slate-50/8;
}

.back-icon {
  @apply text-sm leading-none;
}

.logo {
  @apply h-10;
}

.title {
  @apply text-[22px] font-bold text-[#f7a930];
}

/* hamburger */
.hamburger {
  @apply w-9 h-[26px] flex flex-col justify-between bg-transparent border-none cursor-pointer;
}

.hamburger span {
  @apply h-[3px] rounded-full bg-[#f6f2e6];
}

/* MAIN */
.ticket-main {
  @apply flex-1 px-20 py-10 pb-[60px] bg-cover bg-no-repeat bg-top;
}

.ticket-panel {
  @apply max-w-[1100px] mx-auto grid grid-cols-[minmax(0,1.05fr)_minmax(0,1.4fr)] gap-9;
}

/* left: image */
.img-frame {
  @apply rounded-2xl overflow-hidden bg-[#8b1b14];
}

.img-frame img {
  @apply w-full block;
}

/* right: text */
.event-title {
  @apply text-[26px] tracking-[0.3em] mb-3.5;
}

.meta {
  @apply text-sm m-0;
}

.meta .label {
  @apply font-bold;
}

.paragraphs {
  @apply mt-3.5 text-[13px] leading-normal;
}

.paragraphs p {
  @apply m-0 mb-2;
}

/* price + button */
.price-row {
  @apply mt-[18px] flex flex-col items-end gap-1;
}

.price-block {
  @apply mt-[18px] flex flex-col items-end gap-2;
}

.price-label {
  @apply text-[13px];
}

.price-value {
  @apply text-xl font-bold;
}

.btn-buy {
  @apply mt-3 self-end px-[18px] py-1.5 text-[11px] font-bold rounded border-none cursor-pointer bg-[#f5af3d] text-gray-900;
}

/* posisi sidenav */
:deep(.sb-topright) {
  @apply fixed top-[72px] right-6 w-[260px] max-w-[80vw] z-[60];
}

/* responsive */
@media (max-width: 1024px) {
  .ticket-main {
    @apply px-6 py-8 pb-10;
  }

  .ticket-panel {
    @apply grid-cols-1;
  }

  .price-row {
    @apply items-start;
  }

  .btn-buy {
    @apply self-start;
  }
}
</style>
