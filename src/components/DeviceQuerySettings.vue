<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/use/user'
import { useCameraStore } from '@/use/camera'
import { useJobStore } from '@/use/job'
import { createJob } from '@/lib/pocketbase/job.ts'
import { subscribeDevice, unsubscribeDevice } from '@/lib/pocketbase/device.ts'
import ADCParameterExplanation from '@/components/ADCParameterExplanation.vue'
import JobStateChip from '@/components/JobStateChip.vue'

// Compose
const cameraStore = useCameraStore()
const userStore = useUserStore()
const jobStore = useJobStore()

// State
const cam = ref({ brightness: 0 })
const loading = ref(false)

// Events
onMounted(async () => {
  cam.value = cameraStore.camera()
})

onUnmounted(async () => {
  await unsubscribeDevice(cameraStore.cameraId)
})
// Methods
async function doCreateJob() {
  loading.value = true
  // This performs the job, and updates the job-store with the job states
  await createJob('adc.config.read', userStore.userID, userStore.userProfileID, cameraStore.cameraId,{}, setJobWrapper)
  await subscribeDevice(cameraStore.cameraId, setCameraWrapper)
}

async function setJobWrapper(j){
  // console.log("setJobWrapper", {j})
  jobStore.setJob(j)
  if(!j) {
    loading.value = false
    await unsubscribeDevice(cameraStore.cameraId)
  }
}
async function setCameraWrapper(cam){
  // console.log("setCameraWrapper", {cam})
  cameraStore.setCamera(cam)
  cam.value = cam
}

</script>

<template>
  <v-card class="my-5">
    <v-card-title>Query the device configuration</v-card-title>
    <v-card-text>
      <form @submit.prevent="doCreateJob">
        <v-btn type="submit" color="primary" :loading="loading"> GO </v-btn>
      </form>
      <p>
        You only need to read the settings from the device if you have swapped the device or programmed its settings directly somehow.
        This will synchronise this app with the settings on the device.
      </p>
    </v-card-text>
  </v-card>

  <JobStateChip />

  <v-card class="my-5">
    <v-card-title> Current Configuration </v-card-title>
    <v-card-text>
      <p>Digital Gain: {{ cam.ADC_PGA }},</p>
      <p>Samples per second: {{ cam.ADC_SPS }},</p>
      <p>Black Offset: {{ cam.ADC_VINNEG }}</p>
    </v-card-text>
  </v-card>

  <ADCParameterExplanation />
</template>
