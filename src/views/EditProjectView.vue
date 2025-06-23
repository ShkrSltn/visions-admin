<template>
    <div>
        <v-row>
            <v-col cols="12">
                <div class="d-flex align-center mb-6">
                    <v-btn icon="mdi-arrow-left" variant="text" @click="router.back()"></v-btn>
                    <h1 class="text-h4 font-weight-bold ml-4">Edit Project</h1>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-text>
                        <div class="text-center pa-8">
                            <v-icon size="64" color="grey-lighten-1">mdi-construction</v-icon>
                            <h2 class="text-h5 mt-4">Edit Project Feature</h2>
                            <p class="text-body-1 mt-2">
                                Edit project functionality is coming soon. For now, you can delete and recreate
                                projects.
                            </p>
                            <v-btn color="primary" class="mt-4" to="/projects">
                                Back to Projects
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
