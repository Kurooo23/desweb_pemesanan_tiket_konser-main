<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="topup-backdrop">
        <div class="topup-card">
          <h2 class="topup-title">Top Up Balance</h2>
          <p class="topup-subtitle">
            1 POL = Rp 3.000,00
          </p>

          <!-- INPUT NOMINAL -->
          <label class="topup-label" for="amount-pol">
            Nominal (dalam POL)
          </label>
          <input
            id="amount-pol"
            v-model.number="amountPol"
            type="number"
            min="1"
            step="1"
            class="topup-input"
            placeholder="Masukkan jumlah POL"
          />

          <!-- INFORMASI RUPIAH -->
          <div class="topup-info">
            <div class="topup-info-row">
              <span>Rate</span>
              <span>1 POL = Rp 3.000,00</span>
            </div>
            <div class="topup-info-row topup-info-total">
              <span>Total yang dibayar</span>
              <span>{{ formattedIdr }}</span>
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="topup-actions">
            <button type="button" class="btn-cancel-topup" @click="onCancel">
              BATAL
            </button>
            <button
              type="button"
              class="btn-confirm-topup"
              :disabled="amountPol <= 0"
              @click="onConfirm"
            >
              KONFIRMASI
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
  modelValue: { type: Boolean, required: true }, // v-model
  rate: { type: Number, default: 3000 },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const amountPol = ref(0)

const amountIdr = computed(() => amountPol.value * props.rate)

const formattedIdr = computed(() =>
  amountIdr.value.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
  })
)

watch(
  () => props.modelValue,
  (val) => {
    if (val) amountPol.value = 0 // reset ketika modal dibuka
  }
)

function close() {
  emit('update:modelValue', false)
}

function onCancel() {
  emit('cancel')
  close()
}

function onConfirm() {
  if (amountPol.value <= 0) return
  emit('confirm', amountPol.value)
  close()
}
</script>

<style scoped>
@reference "../assets/tailwind.css";

/* BACKDROP & CARD */
.topup-backdrop {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/60;
}

.topup-card {
  @apply w-[90%] max-w-[420px] rounded-xl bg-white p-6 text-black
    font-sans shadow-lg;
}

/* TITLE */
.topup-title {
  @apply text-center text-lg font-bold mb-1;
}

.topup-subtitle {
  @apply text-center text-xs text-gray-500 mb-4;
}

/* INPUT */
.topup-label {
  @apply block text-sm font-semibold mb-1;
}

.topup-input {
  @apply w-full rounded border border-gray-300 px-3 py-2 text-sm
    focus:outline-none focus:ring-2 focus:ring-[#f7a930] focus:border-[#f7a930];
}

/* INFO */
.topup-info {
  @apply mt-4 space-y-2 text-sm;
}

.topup-info-row {
  @apply flex justify-between;
}

.topup-info-total {
  @apply font-semibold;
}

/* ACTION BUTTONS */
.topup-actions {
  @apply mt-6 flex gap-3;
}

.btn-cancel-topup {
  @apply flex-1 border border-gray-400 bg-white py-2 text-sm font-semibold
    cursor-pointer hover:bg-gray-100;
}

.btn-confirm-topup {
  @apply flex-1 border border-transparent bg-[#f5af3d] py-2 text-sm font-semibold
    text-black cursor-pointer hover:bg-[#f7b94f];
}

.btn-confirm-topup:disabled {
  @apply opacity-50 cursor-not-allowed;
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
