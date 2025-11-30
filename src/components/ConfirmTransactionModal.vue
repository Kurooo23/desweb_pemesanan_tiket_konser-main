<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="modal-backdrop">
        <div class="modal-card">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-center">
              <img src="/MetaMask.png" alt="MetaMask" class="metamask-logo" />
              <span class="metamask-title">MetaMask</span>
            </div>

            <button
              type="button"
              class="modal-close"
              @click="close"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <!-- Title -->
          <h2 class="modal-title">CONFIRM TRANSACTION</h2>

          <!-- Network -->
          <div class="network-row">
            <img src="/polygon.png" alt="Polygon" class="network-logo" />
            <div class="network-name">
              {{ network }}
            </div>
          </div>

          <hr class="divider" />

          <!-- Detail -->
          <div class="details">
            <div class="detail-row">
              <span>Contract Address</span>
              <span class="detail-value-mono">
                {{ shortenedAddress }}
              </span>
            </div>

            <div class="detail-row">
              <span>Amount</span>
              <span class="detail-value">
                {{ amount }}&nbsp;{{ tokenSymbol }}
              </span>
            </div>

            <div class="detail-row">
              <span>Contract Fee</span>
              <span class="detail-value">
                {{ computedContractFee }}&nbsp;{{ tokenSymbol }}
              </span>
            </div>

            <div class="detail-row">
              <span>Gas Fee</span>
              <span class="detail-value">
                {{ gasFee }}&nbsp;{{ tokenSymbol }}
              </span>
            </div>

            <hr class="divider-sm" />

            <div class="detail-total-row">
              <span>Total</span>
              <span class="detail-value">
                {{ total }}&nbsp;{{ tokenSymbol }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions">
            <button
              type="button"
              class="btn-cancel"
              @click="onCancel"
            >
              CANCEL
            </button>
            <button
              type="button"
              class="btn-confirm"
              @click="onConfirm"
            >
              CONFIRM
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  // boleh dikosongkan; kalau kosong akan dibuat random
  contractAddress: { type: String, default: '' },
  amount: { type: Number, required: true },
  // tetap ada supaya tidak bentrok dengan atribut lama, tapi TIDAK dipakai
  contractFee: { type: Number, default: 0 },
  gasFee: { type: Number, required: true },
  tokenSymbol: { type: String, default: 'POL' },
  network: { type: String, default: 'Polygon Mainnet' },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const randomAddress = ref('')

function generateRandomAddress() {
  const hex = '0123456789abcdef'
  let addr = '0x'
  for (let i = 0; i < 40; i++) {
    addr += hex[Math.floor(Math.random() * hex.length)]
  }
  return addr
}

// setiap modal dibuka, generate alamat baru
watch(
  () => props.modelValue,
  (val) => {
    if (val) randomAddress.value = generateRandomAddress()
  }
)

// alamat penuh yang dipakai (props jika ada, kalau tidak pakai random)
const fullAddress = computed(() => {
  const given = (props.contractAddress || '').trim()
  return given || randomAddress.value
})

/** Contract Fee = 10% dari Amount */
const computedContractFee = computed(() => {
  const fee = Number(props.amount) * 0.1
  return Number(fee.toFixed(3)) // dibulatkan 3 decimal (misal 5.5 → 5.500)
})

/** Total = Amount + ContractFee(10%) + GasFee */
const total = computed(() => {
  const val =
    Number(props.amount) +
    computedContractFee.value +
    Number(props.gasFee)
  return Number(val.toFixed(3))
})

const shortenedAddress = computed(() => {
  const addr = fullAddress.value
  if (!addr || addr.length <= 10) return addr
  return `${addr.slice(0, 5)}...${addr.slice(-4)}`
})

function close() {
  emit('update:modelValue', false)
}

function onCancel() {
  emit('cancel')
  close()
}

function onConfirm() {
  emit('confirm', {
    address: fullAddress.value,
    total: total.value,
    amount: props.amount,
    contractFee: computedContractFee.value, // kirim fee 10%
    gasFee: props.gasFee,
  })
  close()
}
</script>

<style scoped>
@reference "../assets/tailwind.css";

/* BACKDROP & CARD */
.modal-backdrop {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/60;
}

.modal-card {
  @apply relative w-[90%] max-w-[460px] rounded-xl bg-white p-6
    text-black font-sans border border-gray-300 shadow-md;
}

/* HEADER */
.modal-header {
  @apply mb-4 flex items-center justify-center relative;
}

.modal-header-center {
  @apply flex items-center gap-2;
}

.metamask-logo {
  @apply h-8 w-8;
}

.metamask-title {
  @apply text-lg font-semibold;
  color: #f29923;
}

.modal-close {
  @apply absolute right-0 top-0 text-xl font-bold leading-none text-black cursor-pointer;
}

/* TITLE */
.modal-title {
  @apply mb-4 text-center text-lg font-bold;
  letter-spacing: 0.1em;
}

/* NETWORK */
.network-row {
  @apply mb-3 flex items-center gap-3;
}

.network-logo {
  @apply h-9 w-9;
}

.network-name {
  @apply text-[15px] font-semibold text-black;
}

/* DIVIDER */
.divider {
  @apply my-3 border-t border-gray-300;
}

.divider-sm {
  @apply my-2 border-t border-gray-300;
}

/* DETAILS */
.details {
  @apply space-y-2 text-[13px] leading-snug text-black;
}

.detail-row {
  @apply flex justify-between;
}

.detail-value {
  @apply text-[13px];
}

.detail-value-mono {
  @apply font-mono text-sm;
}

.detail-total-row {
  @apply flex justify-between pt-1 text-[13px] font-semibold;
}

/* ACTION BUTTONS */
.actions {
  @apply mt-6 flex gap-4;
}

.btn-cancel {
  @apply flex-1 border border-black bg-black py-2 font-semibold text-[#f5af3d] cursor-pointer;
  letter-spacing: 0.16em;
}

.btn-confirm {
  @apply flex-1 border border-transparent py-2 font-semibold text-black cursor-pointer;
  background-color: #f5af3d;
  letter-spacing: 0.16em;
}

/* TRANSITION */
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-200 ease-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
