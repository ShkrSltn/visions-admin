<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useMessage } from 'naive-ui'
import type { CreateProjectDto } from '@/types/project'

const router = useRouter()
const projectsStore = useProjectsStore()
const message = useMessage()

const loading = ref(false)
const formRef = ref()

const languages = [
  { label: 'English', value: 1 },
  { label: 'Russian', value: 2 },
  { label: 'German', value: 3 },
  { label: 'Turkish', value: 4 },
  { label: 'Ukrainian', value: 5 },
]

const projectData = reactive<CreateProjectDto>({
  languageId: 1,
  title: '',
  description: '',
  imageUrl: '',
  demoLink: '',
  codeLink: '',
  featured: false,
  showDemo: true,
  showCode: true,
  orderIndex: 0,
  technologies: [],
})

const technologyInput = ref('')

const rules = {
  title: {
    required: true,
    message: 'Title is required',
    trigger: ['blur', 'input']
  },
  description: {
    required: true,
    message: 'Description is required',
    trigger: ['blur', 'input']
  },
  imageUrl: {
    validator: (rule: any, value: string) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return new Error('Must be a valid URL')
      }
      return true
    },
    trigger: ['blur', 'input']
  },
  demoLink: {
    validator: (rule: any, value: string) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return new Error('Must be a valid URL')
      }
      return true
    },
    trigger: ['blur', 'input']
  },
  codeLink: {
    validator: (rule: any, value: string) => {
      if (value && !/^https?:\/\/.+/.test(value)) {
        return new Error('Must be a valid URL')
      }
      return true
    },
    trigger: ['blur', 'input']
  }
}

function addTechnology() {
  if (technologyInput.value.trim() && !projectData.technologies.includes(technologyInput.value.trim())) {
    projectData.technologies.push(technologyInput.value.trim())
    technologyInput.value = ''
  }
}

function removeTechnology(index: number) {
  projectData.technologies.splice(index, 1)
}

async function submitForm() {
  try {
    await formRef.value?.validate()
    loading.value = true
    await projectsStore.createProject(projectData)
    message.success('Project created successfully')
    router.push('/projects')
  } catch (error) {
    message.error('Failed to create project')
    console.error('Failed to create project:', error)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  Object.assign(projectData, {
    languageId: 1,
    title: '',
    description: '',
    imageUrl: '',
    demoLink: '',
    codeLink: '',
    featured: false,
    showDemo: true,
    showCode: true,
    orderIndex: 0,
    technologies: [],
  })
  technologyInput.value = ''
  formRef.value?.restoreValidation()
}
</script>

<template>
  <div>
    <n-space vertical size="large">
      <div style="display: flex; align-items: center;">
        <n-button text @click="router.back()" style="margin-right: 16px;">
          ← Back
        </n-button>
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Create New Project</h1>
      </div>

      <n-grid :cols="24" :x-gap="24">
        <n-grid-item :span="16">
          <n-card title="Project Information">
            <n-form ref="formRef" :model="projectData" :rules="rules" label-placement="top" label-width="auto"
              require-mark-placement="right-hanging">
              <n-grid :cols="2" :x-gap="16">
                <n-grid-item>
                  <n-form-item label="Language" path="languageId" required>
                    <n-select v-model:value="projectData.languageId" :options="languages"
                      placeholder="Select language" />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item label="Order Index" path="orderIndex">
                    <n-input-number v-model:value="projectData.orderIndex" placeholder="Used for sorting projects" />
                  </n-form-item>
                </n-grid-item>
              </n-grid>

              <n-form-item label="Project Title" path="title" required>
                <n-input v-model:value="projectData.title" placeholder="Enter project title" />
              </n-form-item>

              <n-form-item label="Project Description" path="description" required>
                <n-input v-model:value="projectData.description" type="textarea" :rows="4"
                  placeholder="Enter project description" />
              </n-form-item>

              <n-form-item label="Image URL" path="imageUrl">
                <n-input v-model:value="projectData.imageUrl" placeholder="URL to project screenshot or image" />
              </n-form-item>

              <n-grid :cols="2" :x-gap="16">
                <n-grid-item>
                  <n-form-item label="Demo Link" path="demoLink">
                    <n-input v-model:value="projectData.demoLink" placeholder="Demo URL" />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item>
                  <n-form-item label="Code Repository Link" path="codeLink">
                    <n-input v-model:value="projectData.codeLink" placeholder="GitHub repository URL" />
                  </n-form-item>
                </n-grid-item>
              </n-grid>

              <!-- Technologies Section -->
              <n-form-item label="Add Technology">
                <n-input v-model:value="technologyInput" placeholder="Press Enter to add" @keyup.enter="addTechnology">
                  <template #suffix>
                    <n-button text @click="addTechnology">Add</n-button>
                  </template>
                </n-input>
              </n-form-item>

              <div v-if="projectData.technologies.length > 0">
                <n-text tag="div" style="margin-bottom: 8px; font-weight: 500;">Technologies:</n-text>
                <n-space>
                  <n-tag v-for="(tech, index) in projectData.technologies" :key="index" closable
                    @close="removeTechnology(index)">
                    {{ tech }}
                  </n-tag>
                </n-space>
              </div>

              <!-- Options -->
              <n-form-item label="Options">
                <n-space vertical>
                  <n-checkbox v-model:checked="projectData.featured">
                    Featured Project
                  </n-checkbox>
                  <n-checkbox v-model:checked="projectData.showDemo">
                    Show Demo Button
                  </n-checkbox>
                  <n-checkbox v-model:checked="projectData.showCode">
                    Show Code Button
                  </n-checkbox>
                </n-space>
              </n-form-item>
            </n-form>

            <template #footer>
              <n-space justify="end">
                <n-button @click="resetForm">Reset</n-button>
                <n-button @click="router.back()">Cancel</n-button>
                <n-button type="primary" :loading="loading" @click="submitForm">
                  Create Project
                </n-button>
              </n-space>
            </template>
          </n-card>
        </n-grid-item>

        <!-- Preview Card -->
        <n-grid-item :span="8">
          <n-card title="Preview">
            <div style="border: 2px dashed #e0e0e0; border-radius: 8px; padding: 16px; background-color: #fafafa;">
              <n-image v-if="projectData.imageUrl" :src="projectData.imageUrl" height="200"
                style="margin-bottom: 16px; width: 100%; border-radius: 6px;"
                fallback-src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZGRkIi8+ICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkltYWdlPC90ZXh0Pjwvc3ZnPg==" />

              <h3 style="margin: 0 0 8px 0; font-size: 18px;">{{ projectData.title || 'Project Title' }}</h3>
              <p style="margin: 0 0 16px 0; color: #666; font-size: 14px;">
                {{ projectData.description || 'Project description will appear here...' }}
              </p>

              <n-space v-if="projectData.technologies.length > 0" style="margin-bottom: 16px;">
                <n-tag v-for="tech in projectData.technologies" :key="tech" size="small" type="info">
                  {{ tech }}
                </n-tag>
              </n-space>

              <n-space>
                <n-button v-if="projectData.showDemo" size="small" :disabled="!projectData.demoLink">
                  Demo
                </n-button>
                <n-button v-if="projectData.showCode" size="small" :disabled="!projectData.codeLink">
                  Code
                </n-button>
              </n-space>

              <n-tag v-if="projectData.featured" type="success" size="small" style="margin-top: 8px;">
                Featured
              </n-tag>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-space>
  </div>
</template>
