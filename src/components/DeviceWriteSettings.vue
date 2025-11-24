<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/use/user'
import { useCameraStore } from '@/use/camera'
import ADCParameterExplanation from '@/components/ADCParameterExplanation.vue'
import { createJob } from '@/lib/pocketbase/job.ts'
import { useJobStore } from '@/use/job.ts'
import { subscribeDevice, unsubscribeDevice } from '@/lib/pocketbase/device.ts'

// Compose
const cameraStore = useCameraStore()
const userStore = useUserStore()
const jobStore = useJobStore()

// State
const cam = ref({ brightness: 0 })
const pga = ref(0)
const sps = ref(0)
const loading = ref(false)

// Events
onMounted(async () => {
  cam.value = cameraStore.camera()
  pga.value = cam.value.ADC_PGA
  sps.value = cam.value.ADC_SPS
})
onUnmounted(async () => {
  await unsubscribeDevice(cameraStore.cameraId)
})

// Methods
async function doCreateJob() {
  loading.value = true
  const payload = {
    pga: pga.value,
    sps: sps.value,
  }

  // This performs the job, and updates the job-store with the job states
  await createJob(
    'adc.config.write',
    userStore.userID,
    userStore.userProfileID,
    cameraStore.cameraId,
    payload,
    setJobWrapper,
  )
  await subscribeDevice(cameraStore.cameraId, setCameraWrapper)
}
async function setJobWrapper(j) {
  // console.log("setJobWrapper", {j})
  jobStore.setJob(j)
  if (!j) {
    loading.value = false
    await unsubscribeDevice(cameraStore.cameraId)
  }
}
async function setCameraWrapper(cam) {
  // console.log("setCameraWrapper", {cam})
  cameraStore.setCamera(cam)
  cam.value = cam
}
</script>

<template>
  <v-card>
    <v-card-title>Update the device configuration (write to ADC chip)</v-card-title>
    <v-card-text>
      <form @submit.prevent="doCreateJob">
        <p>Set your desired settings</p>
        <v-container>
          <v-row>
            <v-col cols="5">
              <p>Digital Gain: (currently {{ cam.ADC_PGA }})</p>
            </v-col>
            <v-col>
              <label class="mr-5"> <input type="radio" v-model="pga" value="1" /> x1 </label>
              <label class="mr-5"> <input type="radio" v-model="pga" value="2" /> x2 </label>
              <label class="mr-5"> <input type="radio" v-model="pga" value="4" /> x4 </label>
              <label class="mr-5"> <input type="radio" v-model="pga" value="8" /> x8 </label>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5"> Samples per second: (currently {{ cam.ADC_SPS }}) </v-col>
            <v-col>
              <label class="mr-5"> <input type="radio" v-model="sps" value="15" /> 15 </label>
              <label class="mr-5"> <input type="radio" v-model="sps" value="30" /> 30 </label>
              <label class="mr-5"> <input type="radio" v-model="sps" value="60" /> 60 </label>
              <label class="mr-5"> <input type="radio" v-model="sps" value="240" /> 240 </label>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p>Black Offset: {{ cam.ADC_VINNEG }}</p>
            </v-col>
          </v-row>
        </v-container>
        <v-btn type="submit" color="primary" :loading="loading"> GO </v-btn>
      </form>
    </v-card-text>
  </v-card>

  <ADCParameterExplanation />
</template>
