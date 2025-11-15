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
  <div v-if="cameraStore.camera()" @click="goDevice">
    <span class=" ">
      {{ cameraStore.camera().name }}
    </span>
    (
    <span v-if="!cameraStore.camera().job">idle</span>
    <span v-else>
<!--      {{ cameraStore.camera().job }} - -->
      {{ cameraStore.camera().expand?.job.job }} -
      {{ cameraStore.camera().expand?.job.state }}
    </span>
    )
  </div>
</template>
