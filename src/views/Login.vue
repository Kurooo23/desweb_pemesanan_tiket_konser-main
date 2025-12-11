<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
defineOptions({ name: 'LoginPage' })
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAddress } from 'ethers'
import metaMaskIcon from '@/assets/MetaMask.png'
import { connect, ensureChain, account as accState } from '@/composables/useMetamask'

/* ------------------------------ State ------------------------------ */
const router        = useRouter()
const isConnecting  = ref(false)
const islogining    = ref(false)
const statusMessage = ref('')
const statusType    = ref('')
const hasMetaMask   = ref(true)
const walletAddress = ref('')

watch(accState, (v) => { walletAddress.value = v || '' })

onMounted(() => {
  // Deteksi MetaMask ketika halaman dibuka
  if (typeof window === 'undefined' || !window.ethereum) {
    hasMetaMask.value = false
  }
})

/* ------------------------------ UI utils ------------------------------ */
function showStatus(message, type) {
  statusMessage.value = message
  statusType.value = type // 'success' | 'error' | 'warning'
  setTimeout(() => {
    statusMessage.value = ''
    statusType.value = ''
  }, 5000)
}

function shortenAddress(a) {
  return a ? `${a.slice(0, 6)}...${a.slice(-4)}` : ''
}

/* ------------------------------ Actions ------------------------------ */
async function connectMetaMask() {
  if (typeof window === 'undefined' || !window.ethereum) {
    hasMetaMask.value = false
    showStatus('MetaMask tidak terdeteksi di browser ini.', 'error')
    return
  }

  isConnecting.value = true
  try {
    await connect()
    await ensureChain(import.meta.env.VITE_CHAIN || 'polygon')
    showStatus('Wallet berhasil terhubung!', 'success')
  } catch (e) {
    const m = String(e?.message || e)
    console.error(e)
    showStatus(m, 'error')
  } finally {
    isConnecting.value = false
  }
}

async function loginAccount() {
  if (!walletAddress.value) {
    showStatus('Silakan hubungkan wallet terlebih dahulu!', 'error')
    return
  }

  let addr
  try {
    addr = getAddress(walletAddress.value) // normalisasi checksum
  } catch {
    showStatus('Alamat wallet tidak valid.', 'error')
    return
  }

  islogining.value = true
  try {
    // pastikan sudah di chain yang benar (opsional, tapi bagus)
    await ensureChain(import.meta.env.VITE_CHAIN || 'polygon')

    // TANPA BACKEND:
    // anggap sign-in cukup dengan koneksi wallet
    localStorage.setItem('walletAddress', addr)
    // kalau mau, bisa simpan flag login sederhana
    localStorage.setItem('is_logged_in', 'true')

    showStatus('🎉 Login berhasil tanpa backend!', 'success')

    // arahkan ke halaman utama / dashboard
    router.push({ name: 'home' })
  } catch (e) {
    console.error(e)
    showStatus(String(e?.message || e), 'error')
  } finally {
    islogining.value = false
  }
}
</script>
<template>
  <div class="login-page">
    <div class="login-container">
      <img src="/logo_with_text.png" alt="Logo" class="logo" />
      <h1>Selamat Datang!</h1>

      <p v-if="!hasMetaMask" class="hint">
        Pastikan Anda telah memasang ekstensi MetaMask pada browser Anda atau aplikasi MetaMask pada perangkat seluler Anda.
      </p>

      <p class="subtitle">Hubungkan wallet MetaMask untuk masuk</p>

      <!-- Status Message -->
      <div v-if="statusMessage" :class="['status-message', statusType]">
        {{ statusMessage }}
      </div>

      <!-- Wallet Info -->
      <div v-if="walletAddress" class="wallet-info">
        <div class="wallet-label">
          <img :src="metaMaskIcon" class="mm-ico" alt="MetaMask" />
          <span>Wallet Terhubung</span>
        </div>
        <div class="wallet-address">{{ shortenAddress(walletAddress) }}</div>
      </div>

      <!-- Tombol Connect / Masuk -->
      <button
        v-if="!walletAddress"
        @click="connectMetaMask"
        :disabled="isConnecting"
        class="btn-metamask"
      >
        <template v-if="isConnecting">
          ⏳ Menghubungkan...
        </template>
        <template v-else>
          <img :src="metaMaskIcon" class="mm-ico mm-ico--btn" alt="MetaMask" />
          <span class="btn-label">Hubungkan MetaMask</span>
        </template>
      </button>

      <button
        v-else
        @click="loginAccount"
        :disabled="islogining"
        class="btn-login"
      >
        <span v-if="islogining">⏳ Mendaftarkan...</span>
        <span v-else>Masuk</span>
      </button>

      <div v-if="!hasMetaMask" class="metamask-warning">
        <p>⚠️ MetaMask tidak terdeteksi!</p>
        <a href="https://metamask.io/download/" target="_blank" class="install-link">
          Install MetaMask
        </a>
      </div>
    </div>
  </div>
</template>


<style scoped>
@reference "../assets/tailwind.css";
/* ====== Layout panel login ====== */
.login-page {
  @apply flex justify-center items-center h-screen w-screen bg-[#F4F1DE] m-0 p-0;
}

.login-container {
  @apply bg-[#F4F1DE] px-12 py-10 rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.15)] w-[380px] text-center border-2 border-white/20;
}

.logo {
  @apply w-20 h-auto block mx-auto mb-4;
}

h1 {
  @apply text-gray-800 mb-2 text-[2rem];
}

.subtitle {
  @apply text-[#666] text-[0.9rem] mb-5;
}

.hint {
  @apply my-2 mt-2 mb-3.5 text-[0.85rem] text-[#8a8a8a];
}

/* ====== Status message ====== */
.status-message {
  @apply p-3 rounded-lg mb-4 text-[0.9rem];
  animation: slideDown 0.3s ease;
}

.status-message.success {
  @apply bg-[#d4edda] text-[#155724] border border-[#c3e6cb];
}

.status-message.error {
  @apply bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb];
}

.status-message.warning {
  @apply bg-[#fff3cd] text-[#856404] border border-[#ffeaa7];
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ====== Info wallet ====== */
.wallet-info {
  @apply bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-4 rounded-[10px] mb-4;
  animation: fadeIn 0.3s ease;
}

.wallet-label {
  @apply inline-flex items-center gap-2 text-[0.9rem] font-semibold;
}

.wallet-address {
  @apply text-xl font-mono font-bold mb-1;
}

.wallet-full {
  @apply text-[0.7rem] font-mono opacity-80 break-all leading-[1.2];
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ====== Buttons ====== */
.btn-metamask,
.btn-login {
  @apply w-full py-3.5 border-none rounded-[10px] text-base font-semibold cursor-pointer transition-all duration-300 mb-2.5;
}

/* Tombol MetaMask */
.btn-metamask {
  @apply bg-gradient-to-br from-[#f6851b] to-[#e2761b] text-[#F4F1DE] inline-flex items-center justify-center gap-2.5 leading-none;
}

.btn-metamask:hover:not(:disabled) {
  @apply -translate-y-0.5 shadow-[0_5px_20px_rgba(246,133,27,0.4)];
}

.btn-metamask:disabled {
  @apply opacity-65 cursor-not-allowed;
}

.btn-label {
  @apply font-bold tracking-[0.2px];
}

/* Tombol login */
.btn-login {
  @apply bg-gradient-to-br from-[#41b883] to-[#35a372] text-white;
}

.btn-login:hover:not(:disabled) {
  @apply -translate-y-0.5 shadow-[0_5px_20px_rgba(65,184,131,0.4)];
}

.btn-login:disabled {
  @apply opacity-65 cursor-not-allowed;
}

/* ====== MetaMask warning ====== */
.metamask-warning {
  @apply mt-6 p-4 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg text-[#856404];
}

.metamask-warning p {
  @apply mb-2 font-semibold;
}

.install-link {
  @apply inline-block px-4 py-2 bg-[#f6851b] text-white no-underline rounded-md text-[0.9rem] transition-colors duration-200;
}

.install-link:hover {
  @apply bg-[#e2761b];
}

/* ====== Ikon MetaMask (PNG) ====== */
.mm-ico {
  @apply w-[18px] h-[18px] object-contain inline-block;
}

.mm-ico--btn {
  @apply w-[22px] h-[22px];
}
</style>
