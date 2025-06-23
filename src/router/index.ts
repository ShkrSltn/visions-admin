import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/ProjectsView.vue'),
    },
    {
      path: '/projects/create',
      name: 'create-project',
      component: () => import('@/views/CreateProjectView.vue'),
    },
    {
      path: '/projects/:id/edit',
      name: 'edit-project',
      component: () => import('@/views/EditProjectView.vue'),
    },
    {
      path: '/cv',
      name: 'cv',
      component: () => import('@/views/CVView.vue'),
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('@/views/SkillsView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
    },
  ],
})

export default router
