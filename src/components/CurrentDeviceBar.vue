<script setup lang="ts">
import { useCameraStore } from '@/use/camera'
import { useRouter } from 'vue-router'

// Compose
const cameraStore = useCameraStore()
const router = useRouter()

function goDevice() {
  router.push({ path: '/device' })
}
</script>

<template>
  <div @click="goDevice">
    <span class="ml-10 ">
      {{ cameraStore.camera().name }}
    </span>
    (
    <span v-if="!cameraStore.camera().job">idle</span>
    <span v-else>
      {{ cameraStore.camera().expand.job.job }} -
      {{ cameraStore.camera().expand.job.state }}
    </span>
    )
  </div>
</template>
