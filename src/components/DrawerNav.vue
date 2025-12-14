<script setup>
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const props = defineProps({ modelValue: { type: Boolean, required: true } })
const emit  = defineEmits(['update:modelValue'])

const route = useRoute()
const isOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})
function close(){ isOpen.value = false }

function onKey(e){ if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
watch(() => route.fullPath, close)
</script>

<template>
  <div class="drawer" :class="{ 'is-open': isOpen }">
    <div class="drawer-backdrop" @click="close"></div>

    <div class="drawer-panel" role="dialog" aria-modal="true" @click.stop>
      <nav class="mini-nav" aria-label="Main">
        <RouterLink class="link" active-class="active" to="/home"    @click="close">Home</RouterLink>
        <RouterLink class="link" active-class="active" to="/profile" @click="close">Profile</RouterLink>
        <RouterLink class="link" active-class="active" to="/wallet"  @click="close">Wallet</RouterLink>
        <RouterLink class="link" active-class="active" to="/history" @click="close">History</RouterLink>
        <RouterLink class="link" active-class="active" to="/about"   @click="close">About</RouterLink>
        <RouterLink class="link-btn" to="/logout" @click="close">Log out</RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/tailwind.css";
@layer components {
  /* Drawer base */
  .drawer {
    @apply fixed inset-0 z-[60] pointer-events-none opacity-0 invisible;
    @apply transition-[opacity,visibility] duration-200 ease-in-out;
  }

  .drawer.is-open {
    @apply pointer-events-auto opacity-100 visible;
  }

  /* Drawer backdrop */
  .drawer-backdrop {
    @apply absolute inset-0;
    background: rgba(0, 0, 0, 0.35) !important;
  }

  /* Drawer panel */
  .drawer-panel {
    @apply absolute right-[18px] bottom-[18px] overflow-auto;
    @apply rounded-2xl p-[14px_12px];
    top: clamp(72px, 10vw, 120px);
    width: min(86vw, 320px);

    background: #F4F1DE !important;
    color: #2b1c08 !important;
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);

    @apply translate-x-3 opacity-[0.01];
    @apply transition-[transform,opacity] duration-[220ms] ease-in-out;
  }

  .drawer.is-open .drawer-panel {
    @apply translate-x-0 opacity-100;
  }

  /* Mini navigation */
  .mini-nav {
    @apply grid gap-2.5;
  }

  .link, .link-btn {
    @apply no-underline font-extrabold rounded-xl py-3 px-3.5;
  }

  .link {
    color: #2b1c08 !important;
  }

  .link:hover {
    background: rgba(0, 0, 0, 0.06) !important;
  }

  .link.active {
    background: rgba(0, 0, 0, 0.10) !important;
  }

  .link-btn {
    @apply text-left;
    color: #6b1b12 !important;
  }
}

@media (max-width: 640px) {
  .drawer-panel {
    /* geser ke bawah header, hampir full width */
    @apply right-0.5 rounded-2xl p-2;
    top: 55px;
    bottom: auto;
    width: auto;

    /* animasi tetap enak di HP */
    @apply translate-x-0;
  }

  .mini-nav {
    @apply gap-2;
  }

  .link,
  .link-btn {
    @apply py-2.5 px-4 text-sm;
  }
}
</style>
