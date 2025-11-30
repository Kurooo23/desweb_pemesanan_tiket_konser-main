<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function performLogout() {
  // bersihkan kredensial lokal
  localStorage.removeItem('auth_token')
  localStorage.removeItem('walletAddress')

  // kalau ada state mgmt lain (Pinia/Vuex), reset di sini juga.
  // contoh:
  // const userStore = useUserStore()
  // userStore.$reset()

  router.replace({ name: 'login' }) // atau { name: 'home' }
}

function cancelLogout() {
  // balik ke halaman sebelumnya
  if (window.history.length > 1) router.back()
  else router.replace({ name: 'home' })
}

// pakai native confirm biar cepat
onMounted(() => {
  const ok = window.confirm('Apakah Anda yakin ingin keluar?')
  if (ok) performLogout()
  else cancelLogout()
})
</script>

<template>
  <!-- fallback kalau browser memblokir window.confirm -->
  <div class="wrap">
    <div class="card">
      <h2>Keluar dari akun?</h2>
      <p>Anda akan menghapus sesi login dari perangkat ini.</p>
      <div class="actions">
        <button class="btn danger" @click="performLogout">OK, Keluar</button>
        <button class="btn ghost" @click="cancelLogout">Batal</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/tailwind.css";
.wrap {  @apply min-h-screen grid place-items-center bg-[#0b0d12] text-[#e6e8ef];}
.card {  @apply bg-[#111826] border border-[#222938] rounded-[14px] px-[22px] py-5 max-w-[420px] w-[92%];}
.actions {  @apply flex gap-2.5 justify-end mt-3.5;}
.btn {  @apply px-3.5 py-2.5 rounded-[10px] border border-transparent cursor-pointer;}
.btn.danger {  @apply bg-[#e34b2b] text-white;}
.btn.ghost {  @apply bg-transparent border-[#2a3344] text-[#e6e8ef];}
</style>
