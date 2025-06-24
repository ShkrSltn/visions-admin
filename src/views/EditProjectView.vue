<template>
  <div>
    <n-space vertical size="large">
      <div style="display: flex; align-items: center;">
        <n-button text @click="router.back()" style="margin-right: 16px;">
          ← Back
        </n-button>
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Edit Project</h1>
      </div>

      <n-card>
        <div style="text-align: center; padding: 48px;">
          <div style="font-size: 64px; color: #ccc; margin-bottom: 16px;">🚧</div>
          <h2 style="margin: 0 0 8px 0; font-size: 20px;">Edit Project Feature</h2>
          <p style="margin: 0 0 24px 0; color: #666;">
            Edit project functionality is coming soon. For now, you can delete and recreate
            projects.
          </p>
          <n-button type="primary" @click="router.push('/projects')">
            Back to Projects
          </n-button>
        </div>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
