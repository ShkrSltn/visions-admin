export interface Project {
  id: number
  languageId: number
  title: string
  description: string
  imageUrl?: string
  demoLink?: string
  codeLink?: string
  featured: boolean
  showDemo: boolean
  showCode: boolean
  orderIndex: number
  technologies: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDto {
  languageId: number
  title: string
  description: string
  imageUrl?: string
  demoLink?: string
  codeLink?: string
  featured?: boolean
  showDemo?: boolean
  showCode?: boolean
  orderIndex?: number
  technologies: string[]
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface Language {
  id: number
  code: string
  name: string
  isActive: boolean
  isDefault: boolean
}

export interface ProjectsResponse {
  featuredProjects: Project[]
}
