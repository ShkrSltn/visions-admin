import axios from 'axios'
import type { Project, CreateProjectDto, UpdateProjectDto, ProjectsResponse } from '@/types/project'

const API_BASE_URL = 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const projectsApi = {
  // Get all projects
  async getAll(languageId?: number): Promise<Project[]> {
    const params = languageId ? { languageId } : {}
    const response = await apiClient.get<Project[]>('/projects', { params })
    return response.data
  },

  // Get projects by language code
  async getByLanguage(languageCode: string): Promise<ProjectsResponse> {
    const response = await apiClient.get<ProjectsResponse>(`/projects/by-language/${languageCode}`)
    return response.data
  },

  // Get featured projects
  async getFeatured(languageId?: number): Promise<Project[]> {
    const params = languageId ? { languageId } : {}
    const response = await apiClient.get<Project[]>('/projects/featured', { params })
    return response.data
  },

  // Get project by ID
  async getById(id: number): Promise<Project> {
    const response = await apiClient.get<Project>(`/projects/${id}`)
    return response.data
  },

  // Create new project
  async create(data: CreateProjectDto): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', data)
    return response.data
  },

  // Update project
  async update(id: number, data: UpdateProjectDto): Promise<Project> {
    const response = await apiClient.patch<Project>(`/projects/${id}`, data)
    return response.data
  },

  // Delete project
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/projects/${id}`)
  },

  // Toggle featured status
  async toggleFeatured(id: number): Promise<Project> {
    const response = await apiClient.patch<Project>(`/projects/${id}/toggle-featured`)
    return response.data
  },

  // Reorder projects
  async reorder(languageId: number, projectIds: number[]): Promise<Project[]> {
    const response = await apiClient.patch<Project[]>(`/projects/reorder/${languageId}`, {
      projectIds,
    })
    return response.data
  },
}

export const healthApi = {
  async check(): Promise<{ status: string; timestamp: string; uptime: number }> {
    const response = await apiClient.get('/health')
    return response.data
  },
}

export default apiClient
