<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DrawerNav from '@/components/DrawerNav.vue'
import TopUpModal from '@/components/TopUpModal.vue'

const STORAGE_KEY_BALANCE = 'asiqtix_wallet_balance'
const STORAGE_KEY_TX = 'asiqtix_wallet_transactions'

const route = useRoute()
const sidebarOpen = ref(false)
const toggleSidebar = () => (sidebarOpen.value = !sidebarOpen.value)
watch(
  () => route.fullPath,
  () => (sidebarOpen.value = false)
)

// saldo awal (kalau belum ada di localStorage)
const balancePol = ref(0)

// transaksi: tanpa dummy, hanya data dari localStorage / runtime
const transactions = ref([])

const showTopUp = ref(false)

function onTopUp() {
  showTopUp.value = true
}

// dipanggil ketika user klik KONFIRMASI di modal top up
function handleConfirmTopUp(amountPol) {
  if (!amountPol || amountPol <= 0) return

  balancePol.value += amountPol

  transactions.value.unshift({
    id: Date.now(),
    amount: amountPol,
    date: new Date().toLocaleDateString('id-ID'),
    type: 'topup',
  })
}

/* ====== PERSISTENCE KE LOCALSTORAGE ====== */

onMounted(() => {
  if (typeof window === 'undefined') return

  const savedBalance = window.localStorage.getItem(STORAGE_KEY_BALANCE)
  if (savedBalance !== null) {
    const n = Number(savedBalance)
    if (!Number.isNaN(n)) balancePol.value = n
  }

  const savedTx = window.localStorage.getItem(STORAGE_KEY_TX)
  if (savedTx) {
    try {
      let parsed = JSON.parse(savedTx)
      if (Array.isArray(parsed)) {
        // buang dummy lama (id 1,2,3 purchase)
        parsed = parsed.filter(
          (t) => !(t.id === 1 || t.id === 2 || t.id === 3)
        )
        transactions.value = parsed
      }
    } catch (err) {
      console.error('Failed to parse saved transactions:', err)
    }
  }
})

watch(
  balancePol,
  (val) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY_BALANCE, String(val))
  }
)

watch(
  transactions,
  (val) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(val))
  },
  { deep: true }
)
</script>

<template>
  <div class="wallet-page">
    <!-- TOP BAR -->
    <header class="wallet-topbar">
      <div class="wallet-logo-wrap">
        <img src="/logo_with_text.png" alt="AsiqTIX" class="wallet-logo" />
      </div>
      <h1 class="wallet-title">Wallet</h1>

      <button class="wallet-hamburger" @click="toggleSidebar">
        <span></span><span></span><span></span>
      </button>
    </header>

    <DrawerNav v-model="sidebarOpen" />

    <!-- MAIN CONTENT -->
    <main class="wallet-main">
      <section class="wallet-panel">
        <h2 class="wallet-balance-label">My Balance</h2>
        <p class="wallet-balance-value">
          {{ balancePol }}
          <span class="wallet-balance-unit">POL</span>
        </p>

        <button class="wallet-btn-topup" @click="onTopUp">TOP UP</button>

        <hr class="wallet-separator" />

        <h3 class="wallet-tx-title">Transaction</h3>

        <ul class="wallet-tx-list">
          <li v-for="t in transactions" :key="t.id" class="wallet-tx-item">
            <span
              class="wallet-tx-amount"
              :class="t.type === 'topup'
                ? 'wallet-tx-amount-topup'
                : 'wallet-tx-amount-purchase'"
            >
              <span v-if="t.type === 'topup'">+ </span>
              <span v-else>- </span>{{ t.amount }}
            </span>
            <span class="wallet-tx-date">{{ t.date }}</span>
          </li>

          <li v-if="!transactions.length" class="wallet-tx-item">
            <span class="wallet-tx-amount">–</span>
            <span class="wallet-tx-date">—</span>
          </li>
        </ul>
      </section>
    </main>

    <!-- MODAL TOP UP -->
    <TopUpModal
      v-model="showTopUp"
      :rate="3000"
      @confirm="handleConfirmTopUp"
    />
  </div>
</template>

<style scoped>
@reference "../assets/tailwind.css";

.wallet-page {
  @apply min-h-screen flex flex-col bg-[#6b0a00] text-[#f4f1de] font-sans;
}

/* TOP BAR */
.wallet-topbar {
  @apply sticky top-0 z-50 grid grid-cols-[auto_1fr_auto] items-center px-10 py-4 bg-black;
}

.wallet-logo {
  @apply h-10;
}

.wallet-title {
  @apply text-[22px] text-[#f7a930] ml-4; /* jarak dari logo */
}

/* HAMBURGER */
.wallet-hamburger {
  @apply w-9 h-[26px] flex flex-col justify-between bg-transparent border-none cursor-pointer;
}

.wallet-hamburger span {
  @apply h-[3px] bg-[#f6f2e6] rounded-full;
}

/* MAIN */
.wallet-main {
  @apply flex-1 px-[60px] py-10 pb-[60px];
}

.wallet-panel {
  @apply max-w-[800px] mx-auto;
}

/* BALANCE */
.wallet-balance-label {
  @apply text-[#f7a930] text-3xl;
}

.wallet-balance-value {
  @apply text-[48px] font-bold my-2.5 mt-2.5 mb-5;
}

.wallet-balance-unit {
  @apply text-[48px];
}

/* TOP UP BUTTON */
.wallet-btn-topup {
  @apply bg-[#f4f1de] text-gray-900 border-none px-6 py-2 rounded cursor-pointer font-bold text-xs;
}

/* SEPARATOR */
.wallet-separator {
  @apply border-none border-t-2 border-[#f7a930] my-5 mt-10 mb-5;
}

/* TRANSACTIONS */
.wallet-tx-title {
  @apply text-[#f7a930] text-lg mb-2.5;
}

.wallet-tx-list {
  @apply list-none p-0 m-0;
}

.wallet-tx-item {
  @apply flex justify-between py-2.5 border-t border-[#f7a930];
}

.wallet-tx-item:last-child {
  @apply border-b border-[#f7a930];
}

.wallet-tx-amount {
  @apply text-sm;
}

.wallet-tx-amount-topup {
  @apply text-[#f4f1de];
}

.wallet-tx-amount-purchase {
  @apply text-[#f4f1de];
}

.wallet-tx-date {
  @apply text-[13px];
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .wallet-main {
    @apply px-5 py-[30px] pb-10;
  }
}

@media (max-width: 640px) {
  .wallet-topbar {
    @apply grid-cols-[auto_1fr_auto] items-center px-3 py-3;
  }

  .wallet-logo {
    @apply h-8;
  }

  .wallet-title {
    @apply text-lg ml-2 justify-self-start;
  }

  .wallet-hamburger {
    @apply justify-self-end w-7 h-[24px] flex flex-col justify-between bg-transparent border-none cursor-pointer;
  }

  .wallet-balance-label {
    @apply text-[#f7a930] text-2xl;
  }

  .wallet-balance-value {
    @apply text-[24px] font-bold my-2.5 mt-2.5 mb-5;
  }

  .wallet-balance-unit {
    @apply text-[24px];
  }
}
</style>
