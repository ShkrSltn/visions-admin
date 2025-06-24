<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useMessage, NSwitch, NButton, NSpace } from 'naive-ui'
import type { Project } from '@/types/project'
import type { DataTableColumns } from 'naive-ui'

const router = useRouter()
const projectsStore = useProjectsStore()
const message = useMessage()

const showDeleteModal = ref(false)
const projectToDelete = ref<Project | null>(null)
const selectedLanguage = ref<number | null>(null)
const search = ref('')

const languages = [
  { label: 'English', value: 1 },
  { label: 'Russian', value: 2 },
  { label: 'German', value: 3 },
  { label: 'Turkish', value: 4 },
  { label: 'Ukrainian', value: 5 },
]

const columns: DataTableColumns<any> = [
  { title: 'Title', key: 'title' },
  { title: 'Language', key: 'language' },
  {
    title: 'Featured',
    key: 'featured',
    render(row: any) {
      return h(NSwitch, {
        value: row.featured,
        onUpdateValue: () => toggleFeatured(row)
      })
    }
  },
  { title: 'Order', key: 'orderIndex' },
  { title: 'Technologies', key: 'technologies' },
  { title: 'Created', key: 'createdAt' },
  {
    title: 'Actions',
    key: 'actions',
    render(row: any) {
      return h(NSpace, {}, {
        default: () => [
          h(NButton, {
            size: 'small',
            onClick: () => editProject(row)
          }, { default: () => 'Edit' }),
          h(NButton, {
            size: 'small',
            type: 'error',
            onClick: () => confirmDelete(row)
          }, { default: () => 'Delete' })
        ]
      })
    }
  }
]

const filteredProjects = computed(() => {
  let projects = projectsStore.projects

  if (selectedLanguage.value) {
    projects = projects.filter((p) => p.languageId === selectedLanguage.value)
  }

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.technologies.some((tech) => tech.toLowerCase().includes(searchLower))
    )
  }

  return projects.map(project => ({
    ...project,
    language: getLanguageName(project.languageId),
    technologies: project.technologies.slice(0, 2).join(', ') + (project.technologies.length > 2 ? ` +${project.technologies.length - 2}` : ''),
    createdAt: new Date(project.createdAt).toLocaleDateString()
  }))
})

onMounted(async () => {
  await projectsStore.fetchProjects()
})

async function handleLanguageFilter() {
  await projectsStore.fetchProjects(selectedLanguage.value || undefined)
}

function editProject(project: Project) {
  router.push(`/projects/${project.id}/edit`)
}

function confirmDelete(project: Project) {
  projectToDelete.value = project
  showDeleteModal.value = true
}

async function deleteProject() {
  if (projectToDelete.value) {
    try {
      await projectsStore.deleteProject(projectToDelete.value.id)
      showDeleteModal.value = false
      projectToDelete.value = null
      message.success('Project deleted successfully')
    } catch (error) {
      message.error('Failed to delete project')
      console.error('Failed to delete project:', error)
    }
  }
}

async function toggleFeatured(project: Project) {
  try {
    await projectsStore.toggleProjectFeatured(project.id)
    message.success(`Project ${project.featured ? 'unfeatured' : 'featured'} successfully`)
  } catch (error) {
    message.error('Failed to toggle featured status')
    console.error('Failed to toggle featured status:', error)
  }
}

function getLanguageName(languageId: number) {
  return languages.find((l) => l.value === languageId)?.label || 'Unknown'
}
</script>

<template>
  <div>
    <n-space vertical size="large">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Projects Management</h1>
        <n-button type="primary" @click="router.push('/projects/create')">
          Add New Project
        </n-button>
      </div>

      <!-- Filters -->
      <n-grid :cols="24" :x-gap="16">
        <n-grid-item :span="8">
          <n-input v-model:value="search" placeholder="Search projects..." clearable />
        </n-grid-item>
        <n-grid-item :span="8">
          <n-select v-model:value="selectedLanguage" :options="languages" placeholder="Filter by Language" clearable
            @update:value="handleLanguageFilter" />
        </n-grid-item>
        <n-grid-item :span="8">
          <n-button @click="projectsStore.fetchProjects()">
            Refresh
          </n-button>
        </n-grid-item>
      </n-grid>

      <!-- Projects Table -->
      <n-card>
        <n-data-table :columns="columns" :data="filteredProjects" :loading="projectsStore.loading"
          :pagination="{ pageSize: 10 }">
          <template #empty>
            <div style="text-align: center; padding: 40px;">
              <div style="font-size: 18px; margin-bottom: 8px;">No projects found</div>
              <div style="color: #666; margin-bottom: 16px;">Get started by creating your first project</div>
              <n-button type="primary" @click="router.push('/projects/create')">
                Create Project
              </n-button>
            </div>
          </template>
        </n-data-table>
      </n-card>
    </n-space>

    <!-- Delete Confirmation Modal -->
    <n-modal v-model:show="showDeleteModal">
      <n-card style="width: 600px" title="Confirm Deletion" :bordered="false" size="huge" role="dialog"
        aria-modal="true">
        <p>Are you sure you want to delete the project "{{ projectToDelete?.title }}"? This action cannot be undone.</p>
        <template #footer>
          <n-space justify="end">
            <n-button @click="showDeleteModal = false">Cancel</n-button>
            <n-button type="error" @click="deleteProject">Delete</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
