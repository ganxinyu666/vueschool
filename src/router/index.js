import { createRouter, createWebHistory } from 'vue-router'
import HomePageView from '../views/HomePage.vue'
import NewsDetail from '../views/NewsDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePageView
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: NewsDetail
  },
  {
    path: '/scenic',
    name: 'ScenicCampus',
    component: () => import('@/views/ScenicCampus.vue')
  },
  {
    path: '/architecture',
    name: 'ArchitecturalStyle',
    component: () => import('@/views/ArchitecturalStyle.vue')
  },
  {
    path: '/activities',
    name: 'CulturalActivities',
    component: () => import('@/views/CulturalActivities.vue')
  },
  {
    path: '/achievements',
    name: 'AcademicAchievements',
    component: () => import('@/views/AcademicAchievements.vue')
  },
  {
    path: '/map',
    name: 'CampusMap',
    component: () => import('@/views/CampusMap.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router 