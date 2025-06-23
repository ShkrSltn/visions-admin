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
        icon: 'mdi-folder-multiple',
        color: 'primary',
    },
    {
        title: 'Featured Projects',
        value: projectsStore.featuredProjects.length,
        icon: 'mdi-star',
        color: 'success',
    },
    {
        title: 'Languages Supported',
        value: 5,
        icon: 'mdi-translate',
        color: 'info',
    },
    {
        title: 'API Status',
        value: apiHealth.value?.status === 'ok' ? 'Online' : 'Offline',
        icon: 'mdi-server',
        color: apiHealth.value?.status === 'ok' ? 'success' : 'error',
    },
]
</script>

<template>
    <div>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h4 font-weight-bold mb-6">Dashboard</h1>
            </v-col>
        </v-row>

        <!-- Stats Cards -->
        <v-row>
            <v-col v-for="stat in stats" :key="stat.title" cols="12" sm="6" md="3">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon :color="stat.color" size="40" class="me-4">{{ stat.icon }}</v-icon>
                            <div>
                                <h3 class="text-h6">{{ stat.value }}</h3>
                                <p class="text-body-2 text-medium-emphasis">{{ stat.title }}</p>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Recent Projects -->
        <v-row class="mt-6">
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <v-icon class="me-2">mdi-clock-outline</v-icon>
                        Recent Projects
                    </v-card-title>
                    <v-card-text>
                        <v-data-table :headers="[
                            { title: 'Title', key: 'title' },
                            { title: 'Language', key: 'languageId' },
                            { title: 'Featured', key: 'featured' },
                            { title: 'Technologies', key: 'technologies' },
                            { title: 'Updated', key: 'updatedAt' },
                        ]" :items="projectsStore.projects.slice(0, 5)" :loading="projectsStore.loading"
                            no-data-text="No projects found">
                            <template #item.featured="{ item }">
                                <v-chip :color="item.featured ? 'success' : 'default'" size="small">
                                    {{ item.featured ? 'Yes' : 'No' }}
                                </v-chip>
                            </template>
                            <template #item.technologies="{ item }">
                                <v-chip-group>
                                    <v-chip v-for="tech in item.technologies.slice(0, 3)" :key="tech" size="x-small"
                                        variant="outlined">
                                        {{ tech }}
                                    </v-chip>
                                    <v-chip v-if="item.technologies.length > 3" size="x-small" variant="outlined">
                                        +{{ item.technologies.length - 3 }}
                                    </v-chip>
                                </v-chip-group>
                            </template>
                            <template #item.updatedAt="{ item }">
                                {{ new Date(item.updatedAt).toLocaleDateString() }}
                            </template>
                        </v-data-table>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="text" to="/projects">View All Projects</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-row class="mt-6">
            <v-col cols="12">
                <v-card>
                    <v-card-title>
                        <v-icon class="me-2">mdi-lightning-bolt</v-icon>
                        Quick Actions
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6" md="3">
                                <v-btn color="primary" variant="outlined" block prepend-icon="mdi-plus"
                                    to="/projects/create">
                                    Add Project
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-btn color="secondary" variant="outlined" block prepend-icon="mdi-account-edit">
                                    Edit CV
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-btn color="info" variant="outlined" block prepend-icon="mdi-star-plus">
                                    Add Skill
                                </v-btn>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-btn color="warning" variant="outlined" block prepend-icon="mdi-cog">
                                    Settings
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>
