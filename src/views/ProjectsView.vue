<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import type { Project } from '@/types/project'

const router = useRouter()
const projectsStore = useProjectsStore()

const dialog = ref(false)
const projectToDelete = ref<Project | null>(null)
const selectedLanguage = ref<number | null>(null)
const search = ref('')

const languages = [
    { id: 1, name: 'English', code: 'en' },
    { id: 2, name: 'Russian', code: 'ru' },
    { id: 3, name: 'German', code: 'de' },
    { id: 4, name: 'Turkish', code: 'tr' },
    { id: 5, name: 'Ukrainian', code: 'ua' },
]

const headers = [
    { title: 'Title', key: 'title', sortable: true },
    { title: 'Language', key: 'languageId', sortable: true },
    { title: 'Featured', key: 'featured', sortable: true },
    { title: 'Order', key: 'orderIndex', sortable: true },
    { title: 'Technologies', key: 'technologies', sortable: false },
    { title: 'Created', key: 'createdAt', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false },
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

    return projects
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
    dialog.value = true
}

async function deleteProject() {
    if (projectToDelete.value) {
        try {
            await projectsStore.deleteProject(projectToDelete.value.id)
            dialog.value = false
            projectToDelete.value = null
        } catch (error) {
            console.error('Failed to delete project:', error)
        }
    }
}

async function toggleFeatured(project: Project) {
    try {
        await projectsStore.toggleProjectFeatured(project.id)
    } catch (error) {
        console.error('Failed to toggle featured status:', error)
    }
}

function getLanguageName(languageId: number) {
    return languages.find((l) => l.id === languageId)?.name || 'Unknown'
}
</script>

<template>
    <div>
        <v-row>
            <v-col cols="12">
                <div class="d-flex justify-space-between align-center mb-6">
                    <h1 class="text-h4 font-weight-bold">Projects Management</h1>
                    <v-btn color="primary" prepend-icon="mdi-plus" to="/projects/create">
                        Add New Project
                    </v-btn>
                </div>
            </v-col>
        </v-row>

        <!-- Filters -->
        <v-row class="mb-4">
            <v-col cols="12" md="4">
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Search projects..."
                    variant="outlined" density="compact" clearable></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
                <v-select v-model="selectedLanguage" :items="languages" item-title="name" item-value="id"
                    label="Filter by Language" variant="outlined" density="compact" clearable
                    @update:model-value="handleLanguageFilter"></v-select>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center">
                <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="projectsStore.fetchProjects()">
                    Refresh
                </v-btn>
            </v-col>
        </v-row>

        <!-- Projects Table -->
        <v-card>
            <v-data-table :headers="headers" :items="filteredProjects" :loading="projectsStore.loading" :search="search"
                item-value="id" class="elevation-1">
                <template #item.languageId="{ item }">
                    <v-chip size="small" variant="outlined">
                        {{ getLanguageName(item.languageId) }}
                    </v-chip>
                </template>

                <template #item.featured="{ item }">
                    <v-switch :model-value="item.featured" color="success" density="compact" hide-details
                        @update:model-value="toggleFeatured(item)"></v-switch>
                </template>

                <template #item.technologies="{ item }">
                    <v-chip-group>
                        <v-chip v-for="tech in item.technologies.slice(0, 2)" :key="tech" size="x-small"
                            variant="outlined">
                            {{ tech }}
                        </v-chip>
                        <v-chip v-if="item.technologies.length > 2" size="x-small" variant="outlined">
                            +{{ item.technologies.length - 2 }}
                        </v-chip>
                    </v-chip-group>
                </template>

                <template #item.createdAt="{ item }">
                    {{ new Date(item.createdAt).toLocaleDateString() }}
                </template>

                <template #item.actions="{ item }">
                    <div class="d-flex ga-2">
                        <v-btn size="small" icon="mdi-pencil" variant="text" @click="editProject(item)">
                        </v-btn>
                        <v-btn size="small" icon="mdi-delete" variant="text" color="error" @click="confirmDelete(item)">
                        </v-btn>
                    </div>
                </template>

                <template #no-data>
                    <div class="text-center pa-4">
                        <v-icon size="64" color="grey-lighten-1">mdi-folder-open-outline</v-icon>
                        <p class="text-h6 mt-4">No projects found</p>
                        <p class="text-body-2 text-medium-emphasis">
                            Get started by creating your first project
                        </p>
                        <v-btn color="primary" class="mt-4" to="/projects/create">Create Project</v-btn>
                    </div>
                </template>

                <template #loading>
                    <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
                </template>
            </v-data-table>
        </v-card>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-title class="text-h5">Confirm Deletion</v-card-title>
                <v-card-text>
                    Are you sure you want to delete the project "{{ projectToDelete?.title }}"? This action
                    cannot be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
                    <v-btn color="error" variant="text" @click="deleteProject">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Error Snackbar -->
        <v-snackbar v-model="projectsStore.error" color="error" timeout="5000">
            {{ projectsStore.error }}
            <template #actions>
                <v-btn variant="text" @click="projectsStore.clearError">Close</v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
