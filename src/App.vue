<script setup lang="ts">
import { ref, h } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { MenuOption } from 'naive-ui'
import { PersonCircleOutline, HomeOutline, FolderOpenOutline, DocumentTextOutline, StarOutline, SettingsOutline } from '@vicons/ionicons5'

const router = useRouter()
const collapsed = ref(false)

const menuOptions: MenuOption[] = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    icon: () => h(HomeOutline)
  },
  {
    label: 'Projects',
    key: 'projects',
    icon: () => h(FolderOpenOutline)
  },
  {
    label: 'CV Management',
    key: 'cv',
    icon: () => h(DocumentTextOutline)
  },
  {
    label: 'Skills',
    key: 'skills',
    icon: () => h(StarOutline)
  },
  {
    label: 'Settings',
    key: 'settings',
    icon: () => h(SettingsOutline)
  }
]

const handleMenuUpdate = (key: string) => {
  switch (key) {
    case 'dashboard':
      router.push('/')
      break
    case 'projects':
      router.push('/projects')
      break
    case 'cv':
      router.push('/cv')
      break
    case 'skills':
      router.push('/skills')
      break
    case 'settings':
      router.push('/settings')
      break
  }
}
</script>

<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-layout has-sider style="height: 100vh">
            <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
              show-trigger @collapse="collapsed = true" @expand="collapsed = false">
              <div style="padding: 12px;">
                <n-space vertical align="center">
                  <n-avatar round size="large" src="https://randomuser.me/api/portraits/women/85.jpg" fallback-src="" />
                  <div v-if="!collapsed" style="text-align: center;">
                    <div style="font-weight: 600;">Admin User</div>
                    <div style="font-size: 12px; opacity: 0.7;">Portfolio Manager</div>
                  </div>
                </n-space>
              </div>

              <n-divider style="margin: 12px 0;" />

              <n-menu :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="20" :options="menuOptions"
                :root-indent="18" :indent="12" @update:value="handleMenuUpdate" />
            </n-layout-sider>

            <n-layout>
              <n-layout-header bordered style="height: 64px; padding: 0 24px; display: flex; align-items: center;">
                <h2 style="margin: 0; font-weight: 600;">Visions Portfolio Admin</h2>

                <div style="flex: 1;"></div>

                <n-space>
                  <n-button quaternary circle>
                    <template #icon>
                      <n-icon size="18">
                        <PersonCircleOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </n-space>
              </n-layout-header>

              <n-layout-content content-style="padding: 24px;">
                <RouterView />
              </n-layout-content>
            </n-layout>
          </n-layout>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
/* Naive UI has built-in styles, minimal custom styling needed */
</style>
