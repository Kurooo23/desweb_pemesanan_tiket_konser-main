<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DrawerNav from '@/components/DrawerNav.vue'


// background & gambar konser
import bgHome from '@/assets/home_background.png'
import imgFeast from '@/assets/Feast_Foto.jpg'
import imgSO7 from '@/assets/SO7.jpeg'
import imgGigi from '@/assets/Band-Gigi-2018.jpg'

const search = ref('')
const sidebarOpen = ref(false)
const router = useRouter()

const concerts = [
  {
    id: 1,
    slug: 'feast',                     // ➜ /events=feast
    title: 'FEAST',
    location: 'Dome, Balikpapan',
    date: '10/10/25',
    desc: 'Experience the heartfelt performance of Feast! Enjoy a fusion of rock and alternative music, bringing an unforgettable live concert stage experience.',
    image: imgFeast,
  },
  {
    id: 2,
    slug: 'so7',                       // ➜ /events=so7
    title: 'SHEILA ON 7',
    location: 'Kotaraya Hall, Yogyakarta',
    date: '10/11/25',
    desc: 'Sing your heart out with Sheila On 7! Tiba-tiba and other hit songs will take you back through time, performing timeless favorites that shaped generations.',
    image: imgSO7,
  },
  {
    id: 3,
    slug: 'gigi',                      // ➜ /events=gigi
    title: 'GIGI',
    location: 'Kebunaya, Bogor',
    date: '20/11/25',
    desc: 'Get ready to sing along with Indonesian rock legends GIGI on an electrifying live performance with their best and classic singles.',
    image: imgGigi,
  },
]

const filteredConcerts = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return concerts
  return concerts.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q)
  )
})

const overlayStyle = computed(() => ({
  backgroundImage: `
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.6) 40%,
      rgba(0, 0, 0, 0.9) 80%
    ),
    url(${bgHome})
  `,
  backgroundSize: 'cover',
  backgroundPosition: 'center top',
  backgroundRepeat: 'no-repeat',
}))

const goToTicket = (slug) => {
  router.push({
    name: 'event-ticket',
    params: { slug },          // akan jadi /events=feast /events=so7 /events=gigi
  })
}
</script>

<template>
  <div class="home-page">
    <div class="overlay" :style="overlayStyle">
      <!-- NAVBAR -->
      <header class="top-bar">
        <div class="top-left">
          <img src="/logo_with_text.png" alt="AsiqTIX" class="logo" />
        </div>

        <div class="top-search">
          <input
            v-model="search"
            type="text"
            placeholder="Type here..."
            class="search-input"
          />
        </div>

        <!-- hamburger -->
        <button
          class="menu-button"
          aria-label="Menu"
          @click="sidebarOpen = !sidebarOpen"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      <!-- MAIN CONTENT -->
      <main class="content">
        <section class="concert-section">
          <h2 class="section-title">UPCOMING CONCERTS</h2>

          <div class="concert-grid">
            <article
              v-for="c in filteredConcerts"
              :key="c.id"
              class="concert-card"
            >
              <div class="card-image-wrap">
                <img :src="c.image" :alt="c.title" class="card-image" />
              </div>
              <div class="card-body">
                <h3 class="card-title">{{ c.title }}</h3>
                <p class="card-meta">
                  <span class="meta-label">Location:</span>
                  {{ c.location }}
                </p>
                <p class="card-meta">
                  <span class="meta-label">Date:</span>
                  {{ c.date }}
                </p>
                <p class="card-desc">
                  {{ c.desc }}
                </p>
                <button
                  class="btn-buy"
                  @click="goToTicket(c.slug)"
                >
                  BUY TICKET
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>

      <!-- SideNav -->
      <DrawerNav v-model="sidebarOpen" />
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/tailwind.css";
/* ===== Root ===== */
.home-page { @apply min-h-screen bg-black; }
.overlay   { @apply min-h-screen flex flex-col; }

/* ===== TOP BAR ===== */
.top-bar   { @apply flex items-center gap-6 px-4 py-3 sm:px-6 lg:px-12 bg-black text-white; }
.top-left  { @apply flex items-center; }
.logo      { @apply h-10 object-contain; }

/* Search bar */
.top-search   { @apply relative flex-1 max-w-3xl mx-auto; }
.search-input { @apply w-full rounded-full border-0 outline-none bg-[#f6f2e6] text-black placeholder:text-gray-600 caret-black py-3 pl-5 pr-12; }
.search-icon  { @apply absolute right-15 top-1/2 -translate-y-1/2 text-[18px]; }

/* Hamburger */
.menu-button      { @apply w-9 h-7 flex flex-col justify-between bg-transparent border-0 cursor-pointer; }
.menu-button span { @apply h-[3px] rounded-full bg-[#f6f2e6]; }

/* ===== CONTENT ===== */
.content         { @apply flex-1 px-4 py-6 sm:px-6 lg:px-16 lg:py-10 text-white; }
.concert-section { @apply max-w-6xl mx-auto text-center; }
.section-title   { @apply text-3xl tracking-[0.16em] mb-8; }

/* Grid */
.concert-grid { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6; }

/* Card */
.concert-card      { @apply bg-gradient-to-b from-[#f1f1f1] via-[#7a0202] to-[#3b0000] rounded-2xl overflow-hidden text-white flex flex-col; }
.card-image-wrap   { @apply bg-neutral-800; }
.card-image        { @apply w-full h-[190px] object-cover; }
.card-body         { @apply p-5 text-left; }
.card-title        { @apply text-xl tracking-[0.2em] mb-2; }
.card-meta         { @apply text-sm mb-1; }
.meta-label        { @apply font-semibold; }
.card-desc         { @apply text-xs my-3 leading-relaxed; }
.btn-buy           { @apply inline-block px-4 py-2 rounded bg-[#ffcc33] font-bold text-black text-xs cursor-pointer; }

</style>
