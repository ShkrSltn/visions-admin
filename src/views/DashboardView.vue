<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { healthApi } from '@/services/api'

const projectsStore = useProjectsStore()
const apiHealth = ref<{ status: string; uptime: number } | null>(null)

onMounted(async () => {
  try {
    await projectsStore.fetchProjects()
    apiHealth.value = await healthApi.check()
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
})

const stats = [
  {
    title: 'Total Projects',
    value: projectsStore.projects.length,
    color: '#18a058',
  },
  {
    title: 'Featured Projects',
    value: projectsStore.featuredProjects.length,
    color: '#f0a020',
  },
  {
    title: 'Languages Supported',
    value: 5,
    color: '#2080f0',
  },
  {
    title: 'API Status',
    value: apiHealth.value?.status === 'ok' ? 'Online' : 'Offline',
    color: apiHealth.value?.status === 'ok' ? '#18a058' : '#d03050',
  },
]

const tableColumns = [
  { title: 'Title', key: 'title' },
  { title: 'Language', key: 'languageId' },
  { title: 'Featured', key: 'featured' },
  { title: 'Technologies', key: 'technologies' },
  { title: 'Updated', key: 'updatedAt' },
]

const tableData = projectsStore.projects.slice(0, 5).map(project => ({
  ...project,
  languageId: getLanguageName(project.languageId),
  featured: project.featured ? 'Yes' : 'No',
  technologies: project.technologies.slice(0, 3).join(', ') + (project.technologies.length > 3 ? ` +${project.technologies.length - 3}` : ''),
  updatedAt: new Date(project.updatedAt).toLocaleDateString()
}))

function getLanguageName(languageId: number) {
  const languages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Russian' },
    { id: 3, name: 'German' },
    { id: 4, name: 'Turkish' },
    { id: 5, name: 'Ukrainian' },
  ]
  return languages.find((l) => l.id === languageId)?.name || 'Unknown'
}
</script>

<template>
  <div>
    <n-space vertical size="large">
      <div>
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Dashboard</h1>
      </div>

      <!-- Stats Cards -->
      <n-grid :cols="4" :x-gap="16" responsive="screen">
        <n-grid-item v-for="stat in stats" :key="stat.title">
          <n-card>
            <n-statistic :label="stat.title" :value="stat.value" />
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- Recent Projects -->
      <n-card title="Recent Projects">
        <template #header-extra>
          <n-button text tag="a" href="/projects">
            View All Projects
          </n-button>
        </template>

        <n-data-table :columns="tableColumns" :data="tableData" :loading="projectsStore.loading" :pagination="false" />
      </n-card>

      <!-- Quick Actions -->
      <n-card title="Quick Actions">
        <n-grid :cols="4" :x-gap="16" responsive="screen">
          <n-grid-item>
            <n-button block type="primary" @click="$router.push('/projects/create')">
              Add Project
            </n-button>
          </n-grid-item>
          <n-grid-item>
            <n-button block secondary @click="$router.push('/cv')">
              Edit CV
            </n-button>
          </n-grid-item>
          <n-grid-item>
            <n-button block tertiary @click="$router.push('/skills')">
              Add Skill
            </n-button>
          </n-grid-item>
          <n-grid-item>
            <n-button block quaternary @click="$router.push('/settings')">
              Settings
            </n-button>
          </n-grid-item>
        </n-grid>
      </n-card>
    </n-space>
  </div>
</template>
