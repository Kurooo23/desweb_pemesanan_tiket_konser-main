<template>
    <transition name="fade">
      <div v-if="modelValue" class="ticket-backdrop">
        <!-- KOTAK TERLUAR -->
        <div class="ticket-shell">
          <!-- Ini yang akan di-screenshot saat download -->
          <div ref="ticketRef" class="ticket-card">
            <div class="ticket-inner">
              <div class="ticket-left">
                <div class="ticket-img-wrap">
                  <img :src="image" :alt="title" class="ticket-img" />
                </div>
              </div>

              <div class="ticket-right">
                <div class="ticket-name">“{{ title }}”</div>

                <div class="ticket-label">ID</div>
                <div class="ticket-value ticket-id">
                  {{ booking }}
                </div>

                <div class="ticket-label">TEMPAT</div>
                <div class="ticket-value">
                  {{ place }}
                </div>

                <div class="ticket-label">WAKTU</div>
                <div class="ticket-value">
                  {{ datetime }}
                </div>
              </div>
            </div>
          </div>

          <!-- AREA BUTTON DI KOTAK LUAR -->
          <div class="ticket-actions">
            <!-- CLOSE kiri -->
            <button
              type="button"
              class="ticket-btn ticket-btn-close"
              @click="close"
            >
              CLOSE
            </button>

            <!-- DOWNLOAD kanan -->
            <button
              type="button"
              class="ticket-btn ticket-btn-download"
              @click="downloadTicket"
            >
              DOWNLOAD
            </button>
          </div>
        </div>
      </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue'
import html2canvas from 'html2canvas-pro'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, required: true },
  booking: { type: String, required: true },
  place: { type: String, required: true },
  datetime: { type: String, required: true },
  image: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])

const ticketRef = ref(null)

function close() {
  emit('update:modelValue', false)
}

async function downloadTicket() {
  if (!ticketRef.value) return

  let canvas

  try {
    // Coba render pakai html2canvas seperti biasa
    canvas = await html2canvas(ticketRef.value, {
      backgroundColor: null,
      scale: 2,
    })
  } catch (err) {
    console.error('Failed to render ticket with html2canvas:', err)
  }

  // Kalau sampai sini, selalu punya canvas (hasil html2canvas atau fallback)
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  const safeTitle = (props.title || 'concert')
    .toString()
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()

  link.href = dataUrl
  link.download = `ticket-${safeTitle}.png`

  // append ke DOM supaya kliknya benar-benar dieksekusi browser
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


</script>

<style scoped>
@reference "../assets/tailwind.css";

/* BACKDROP */
.ticket-backdrop {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/60;
}

/* KOTAK TERLUAR */
.ticket-shell {
  @apply w-[95%] max-w-[820px] rounded-[34px] bg-[#111827] px-10 py-8 flex flex-col items-center gap-5;
}

/* KOTAK KREM + BIRU DI DALAMNYA */
.ticket-card {
  @apply w-full rounded-[30px] bg-[#f4f1de] px-8 py-7;
}

.ticket-inner {
  @apply flex gap-6 items-center rounded-[26px] bg-[#1c2147] px-8 py-6 text-white;
}

/* LEFT IMAGE */
.ticket-left {
  @apply shrink-0;
}

.ticket-img-wrap {
  @apply rounded-xl overflow-hidden bg-white w-[190px] h-[190px];
}

.ticket-img {
  @apply w-full h-full object-cover;
}

/* RIGHT CONTENT */
.ticket-right {
  @apply flex-1 text-left;
}

.ticket-name {
  @apply text-xl font-semibold text-center text-white mb-4;
}

.ticket-label {
  @apply text-xs font-semibold text-gray-200 mt-2;
}

.ticket-value {
  @apply text-sm text-white;
}

.ticket-id {
  @apply break-all text-[11px];
}

/* AREA BUTTON DI BAWAH TIKET */
.ticket-actions {
  @apply w-full flex justify-center gap-4;
}

.ticket-btn {
  @apply px-8 py-2 rounded font-bold cursor-pointer text-sm;
}

.ticket-btn-download {
  @apply bg-white text-black;
}

.ticket-btn-close {
  background-color: #f5af3d;
  @apply text-black;
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

@media (max-width: 640px) {
  .ticket-shell {
    @apply w-[96%] px-4 py-5 rounded-2xl gap-4;
  }

  .ticket-card {
    @apply px-4 py-4 rounded-2xl;
  }

  .ticket-inner {
    @apply flex-col items-center gap-4 px-4 py-4;
  }

  .ticket-left {
    @apply w-full flex justify-center;
  }

  .ticket-img-wrap {
    @apply w-[100px] h-[100px] rounded-xl;
  }

  .ticket-right {
    @apply w-full text-left;
  }

  .ticket-name {
    @apply text-lg mb-2 text-center;
  }

  .ticket-label {
    @apply text-[11px];
  }

  .ticket-value {
    @apply text-[13px];
  }

  .ticket-id {
    @apply text-[10px];
  }

  .ticket-actions {
    @apply w-full mt-1 flex justify-center gap-3;
  }

  .ticket-btn {
    @apply flex-1 px-4 py-2 text-xs;
  }
}

</style>
