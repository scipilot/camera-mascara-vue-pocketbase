<script setup lang="ts">
import { useCameraStore } from '@/use/camera'
import { useRouter } from 'vue-router'

// Compose
const cameraStore = useCameraStore()
const router = useRouter()

</script>

<template>
  <div>

    <span v-if="!cameraStore.camera().job">idle</span>
    <span v-else>
      <v-progress-circular indeterminate size="small"></v-progress-circular>
<!--      {{ cameraStore.camera().job }} - -->
      {{ cameraStore.camera().expand?.job.job }} -
      {{ cameraStore.camera().expand?.job.state }}
    </span>
    {{ cameraStore.camera().expand?.job.image_size }} x {{ cameraStore.camera().expand?.job.image_size }}
    + {{ cameraStore.camera().expand?.job.mask_pixel_size }}
    - {{ cameraStore.camera().expand?.job.mask_type }}

<!--
    <p>
      <pre>
        {{cameraStore.camera().expand?.job}}
      </pre>
    </p>
      {
  "camera": "l23p04fh17l051m",
  "collectionId": "pbc_1125843985",
  "collectionName": "jobs",
  "created": "2025-11-22 19:40:32.399Z",
  "id": "k51jocyuu1f7q75",
  "image_size": 128,
  "job": "capture",
  "mask_pixel_size": 4,
  "mask_type": "point",
  "pga": "",
  "sps": "",
  "state": "running",
  "title": "",
  "updated": "2025-11-22 19:40:39.479Z",
  "user": "k5fzarjlo43wbji"
}
-->

    <!--
        <p>
            {{cameraStore.camera().expand?.job.mask_pixel_size}}
        </p>
        <p>
            Resolution: {{cameraStore.camera().expand?.job.image_size}} x
            Resolution: {{cameraStore.camera().expand?.job.image_size}}
        </p>
    -->

  </div>
</template>
