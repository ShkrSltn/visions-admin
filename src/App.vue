<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const drawer = ref(true)
const rail = ref(false)
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent>
      <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="Admin User"
        subtitle="Portfolio Manager" nav>
        <template #append>
          <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" to="/"></v-list-item>

        <v-list-item prepend-icon="mdi-folder-multiple" title="Projects" value="projects" to="/projects"></v-list-item>

        <v-list-item prepend-icon="mdi-account-circle" title="CV Management" value="cv" to="/cv"></v-list-item>

        <v-list-item prepend-icon="mdi-star-circle" title="Skills" value="skills" to="/skills"></v-list-item>

        <v-list-item prepend-icon="mdi-cog" title="Settings" value="settings" to="/settings"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Visions Portfolio Admin</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-theme-light-dark" variant="text"></v-btn>
      <v-btn icon="mdi-account-circle" variant="text"></v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
