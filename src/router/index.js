// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: Login },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: () => import('@/views/About.vue') },
    { path: '/profile', name: 'profile', component: () => import('@/views/Profile.vue')},
    { path: '/logout', name: 'logout', component: () => import('@/views/LogoutConfirm.vue') },
    { path: '/wallet', name: 'wallet', component: () => import('@/views/Wallet.vue') },
    { path: '/history', name: 'history', component: () => import('@/views/History.vue') },
    { path: '/events=:slug', name: 'event-ticket', component: () => import('@/views/EventTicketView.vue'), props: true, },
  ]
})

export default router
