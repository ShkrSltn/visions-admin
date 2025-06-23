import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, CreateProjectDto, UpdateProjectDto } from '@/types/project'
import { projectsApi } from '@/services/api'

export const useProjectsStore = defineStore('projects', () => {
  // State
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedLanguageId = ref<number | null>(null)

  // Getters
  const featuredProjects = computed(() => projects.value.filter((p) => p.featured))
  const projectsByLanguage = computed(() => {
    if (!selectedLanguageId.value) return projects.value
    return projects.value.filter((p) => p.languageId === selectedLanguageId.value)
  })

  // Actions
  async function fetchProjects(languageId?: number) {
    loading.value = true
    error.value = null
    try {
      projects.value = await projectsApi.getAll(languageId)
      if (languageId) selectedLanguageId.value = languageId
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch projects'
      console.error('Error fetching projects:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchProjectsByLanguage(languageCode: string) {
    loading.value = true
    error.value = null
    try {
      const response = await projectsApi.getByLanguage(languageCode)
      projects.value = response.featuredProjects
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch projects'
      console.error('Error fetching projects by language:', err)
    } finally {
      loading.value = false
    }
  }

  async function createProject(data: CreateProjectDto) {
    loading.value = true
    error.value = null
    try {
      const newProject = await projectsApi.create(data)
      projects.value.push(newProject)
      return newProject
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create project'
      console.error('Error creating project:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProject(id: number, data: UpdateProjectDto) {
    loading.value = true
    error.value = null
    try {
      const updatedProject = await projectsApi.update(id, data)
      const index = projects.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }
      return updatedProject
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update project'
      console.error('Error updating project:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProject(id: number) {
    loading.value = true
    error.value = null
    try {
      await projectsApi.delete(id)
      projects.value = projects.value.filter((p) => p.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete project'
      console.error('Error deleting project:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleProjectFeatured(id: number) {
    loading.value = true
    error.value = null
    try {
      const updatedProject = await projectsApi.toggleFeatured(id)
      const index = projects.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        projects.value[index] = updatedProject
      }
      return updatedProject
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to toggle featured status'
      console.error('Error toggling featured status:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function reorderProjects(languageId: number, projectIds: number[]) {
    loading.value = true
    error.value = null
    try {
      const reorderedProjects = await projectsApi.reorder(languageId, projectIds)
      // Update only projects for this language
      projects.value = projects.value.filter((p) => p.languageId !== languageId)
      projects.value.push(...reorderedProjects)
      projects.value.sort((a, b) => a.orderIndex - b.orderIndex)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to reorder projects'
      console.error('Error reordering projects:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    projects,
    loading,
    error,
    selectedLanguageId,
    // Getters
    featuredProjects,
    projectsByLanguage,
    // Actions
    fetchProjects,
    fetchProjectsByLanguage,
    createProject,
    updateProject,
    deleteProject,
    toggleProjectFeatured,
    reorderProjects,
    clearError,
  }
})
