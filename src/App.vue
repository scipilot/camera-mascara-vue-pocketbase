<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import CurrentDeviceBar from '@/components/CurrentDeviceBar.vue'
import pb from '@/lib/pocketbase'
import { useUserStore } from '@/use/user.ts'

const router = useRouter()
const userStore = useUserStore()

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    userStore.clear()
    pb.authStore.clear()
    router.push({ path: '/' })
  }
}
const links = ['Gallery', 'Camera', 'Meter', 'Device']
</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-title>
        Camera Mascara
      </v-app-bar-title>

      <CurrentDeviceBar />

      <v-btn to="/">Home</v-btn>

      <v-btn v-if="pb.authStore.token" to="/gallery"> Images </v-btn>

      <v-btn v-if="pb.authStore.token" to="/camera"> Camera </v-btn>

      <v-btn v-if="pb.authStore.token" to="/meter"> Meter </v-btn>

      <v-btn v-if="pb.authStore.token" to="/device"> Pi </v-btn>

      <v-btn v-if="pb.authStore.token" @click="logout"> Logout </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12" md="2"> </v-col>

          <v-col cols="12" md="8">
            <RouterView />
          </v-col>

          <v-col cols="12" md="2"> </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>
