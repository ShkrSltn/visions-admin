<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import type { CreateProjectDto } from '@/types/project'

const router = useRouter()
const projectsStore = useProjectsStore()

const loading = ref(false)
const form = ref()

const languages = [
    { id: 1, name: 'English', code: 'en' },
    { id: 2, name: 'Russian', code: 'ru' },
    { id: 3, name: 'German', code: 'de' },
    { id: 4, name: 'Turkish', code: 'tr' },
    { id: 5, name: 'Ukrainian', code: 'ua' },
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
    required: (value: string) => !!value || 'This field is required',
    url: (value: string) =>
        !value || /^https?:\/\/.+/.test(value) || 'Must be a valid URL',
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
    const { valid } = await form.value.validate()
    if (!valid) return

    loading.value = true
    try {
        await projectsStore.createProject(projectData)
        router.push('/projects')
    } catch (error) {
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
    form.value?.resetValidation()
}
</script>

<template>
    <div>
        <v-row>
            <v-col cols="12">
                <div class="d-flex align-center mb-6">
                    <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()"></v-btn>
                    <h1 class="text-h4 font-weight-bold ml-4">Create New Project</h1>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" lg="8">
                <v-card>
                    <v-card-title>Project Information</v-card-title>
                    <v-card-text>
                        <v-form ref="form" @submit.prevent="submitForm">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-select v-model="projectData.languageId" :items="languages" item-title="name"
                                        item-value="id" label="Language *" variant="outlined"
                                        :rules="[rules.required]"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="projectData.orderIndex" label="Order Index" type="number"
                                        variant="outlined" hint="Used for sorting projects"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="projectData.title" label="Project Title *" variant="outlined"
                                        :rules="[rules.required]"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-textarea v-model="projectData.description" label="Project Description *"
                                        variant="outlined" rows="4" :rules="[rules.required]"></v-textarea>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="projectData.imageUrl" label="Image URL" variant="outlined"
                                        :rules="[rules.url]" hint="URL to project screenshot or image"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="projectData.demoLink" label="Demo Link" variant="outlined"
                                        :rules="[rules.url]"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="projectData.codeLink" label="Code Repository Link"
                                        variant="outlined" :rules="[rules.url]"></v-text-field>
                                </v-col>
                            </v-row>

                            <!-- Technologies Section -->
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="technologyInput" label="Add Technology" variant="outlined"
                                        append-inner-icon="mdi-plus" @click:append-inner="addTechnology"
                                        @keyup.enter="addTechnology"
                                        hint="Press Enter or click + to add"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row v-if="projectData.technologies.length > 0">
                                <v-col cols="12">
                                    <p class="text-subtitle-2 mb-2">Technologies:</p>
                                    <v-chip-group>
                                        <v-chip v-for="(tech, index) in projectData.technologies" :key="index" closable
                                            @click:close="removeTechnology(index)">
                                            {{ tech }}
                                        </v-chip>
                                    </v-chip-group>
                                </v-col>
                            </v-row>

                            <!-- Options -->
                            <v-row>
                                <v-col cols="12">
                                    <p class="text-subtitle-2 mb-2">Options:</p>
                                    <v-switch v-model="projectData.featured" label="Featured Project" color="success"
                                        density="compact"></v-switch>
                                    <v-switch v-model="projectData.showDemo" label="Show Demo Button" color="primary"
                                        density="compact"></v-switch>
                                    <v-switch v-model="projectData.showCode" label="Show Code Button" color="primary"
                                        density="compact"></v-switch>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn variant="outlined" @click="resetForm">Reset</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn variant="text" @click="router.back()">Cancel</v-btn>
                        <v-btn color="primary" :loading="loading" @click="submitForm">
                            Create Project
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <!-- Preview Card -->
            <v-col cols="12" lg="4">
                <v-card>
                    <v-card-title>Preview</v-card-title>
                    <v-card-text>
                        <div class="preview-container">
                            <v-img v-if="projectData.imageUrl" :src="projectData.imageUrl" height="200" class="mb-4"
                                cover>
                                <template #error>
                                    <v-container fill-height>
                                        <v-row align="center" justify="center">
                                            <v-icon size="64" color="grey-lighten-1">mdi-image-broken</v-icon>
                                        </v-row>
                                    </v-container>
                                </template>
                            </v-img>

                            <h3 class="text-h6 mb-2">{{ projectData.title || 'Project Title' }}</h3>
                            <p class="text-body-2 mb-4">
                                {{ projectData.description || 'Project description will appear here...' }}
                            </p>

                            <v-chip-group v-if="projectData.technologies.length > 0" class="mb-4">
                                <v-chip v-for="tech in projectData.technologies" :key="tech" size="small"
                                    variant="outlined">
                                    {{ tech }}
                                </v-chip>
                            </v-chip-group>

                            <div class="d-flex ga-2">
                                <v-btn v-if="projectData.showDemo" size="small" variant="outlined"
                                    :disabled="!projectData.demoLink">
                                    Demo
                                </v-btn>
                                <v-btn v-if="projectData.showCode" size="small" variant="outlined"
                                    :disabled="!projectData.codeLink">
                                    Code
                                </v-btn>
                            </div>

                            <v-chip v-if="projectData.featured" color="success" size="small" class="mt-2">
                                Featured
                            </v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<style scoped>
.preview-container {
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    background-color: #fafafa;
}
</style>
