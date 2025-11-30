<template>
  <transition name="fade">
    <div v-if="modelValue" class="status-backdrop">
      <div class="status-card">
        <h2 class="status-title">
          {{ title }}
        </h2>
        <p class="status-message">
          {{ message }}
        </p>
        <button class="status-btn" type="button" @click="close">
          CLOSE
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
@reference "../assets/tailwind.css";

.status-backdrop {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/60;
}

.status-card {
  @apply w-[90%] max-w-[480px] rounded-xl bg-white p-8 text-center text-black shadow-md;
}

.status-title {
  @apply text-2xl font-bold mb-4;
}

.status-message {
  @apply text-base mb-6;
}

.status-btn {
  @apply px-6 py-2 font-bold rounded cursor-pointer bg-[#f5af3d] text-black;
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-200 ease-out;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
