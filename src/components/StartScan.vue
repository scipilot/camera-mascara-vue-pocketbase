<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/use/user'
import { useCameraStore } from '@/use/camera'
import { useJobStore } from '@/use/job.ts'
import pb from '@/lib/pocketbase'
import { createJob } from '@/lib/pocketbase/job.ts'

// Compose
const userStore = useUserStore()
const cameraStore = useCameraStore()
const jobStore = useJobStore()

// Events
const emit = defineEmits(['JobCreated'])

// State
const title = ref('')
// the radios need string values
const image_size = ref('64')
const mask_pixel_size = ref('2')
const loading = ref(false)

const availableCombinations = {
  '4': [1],
  '16': [2],
  '32': [2, 4],
  '64': [2, 4, 8],
  '128': [4, 8],
}

function available(image_size: string, mask_pixel_size: string) {
  return availableCombinations[image_size].includes(mask_pixel_size)
}

// Methods
// Methods
async function doCreateJob() {
  loading.value = true
  const payload = {
    title: title.value,
    image_size: image_size.value,
    mask_pixel_size: mask_pixel_size.value,
  }

  // This performs the job, and updates the job-store with the job states
  await createJob(
    'capture',
    userStore.userID,
    userStore.userProfileID,
    cameraStore.cameraId,
    payload,
    setJobWrapper,
  )
}
function setJobWrapper(j) {
  // console.log("setJobWrapper", {j})
  jobStore.setJob(j)
  if (!j) loading.value = false
}

</script>

<template>
  <v-card class="my-5">
    <v-card-title class="pa-5">Create new image</v-card-title>
    <v-card-text class="pa-5">
      <v-sheet class="mx-auto">
        <v-form @submit.prevent="doCreateJob">
          <label>
            <span>Title</span>
            <v-text-field v-model="title" placeholder="(leave blank for auto name)" />
          </label>
          <div>
            <p>Image Resolution</p>
            <v-radio-group v-model="image_size" inline>
              <v-radio value="4" label="4" />
              <v-radio value="16" label="16" />
              <v-radio value="32" label="32" />
              <v-radio value="64" label="64" />
              <v-radio value="128" label="128" />
            </v-radio-group>
          </div>
          <div>
            <p>Mask Pixel Size</p>
            <v-radio-group v-model="mask_pixel_size" inline>
              <v-radio value="1" label="1" :disabled="!available(image_size, 1)" />
              <v-radio value="2" label="2" :disabled="!available(image_size, 2)" />
              <v-radio value="4" label="4" :disabled="!available(image_size, 4)" />
              <v-radio value="8" label="8" :disabled="!available(image_size, 8)" />
            </v-radio-group>
          </div>
          <p>
            Not all combinations are available. Try these: 1x1+4x4 2x2+16x16 2x2+32x32 2x2+64x64
            4x4+128x128 4x4+32x32 4x4+64x64 6x6+64x64 8x8+64x64 8x8+128x128x
          </p>
          <v-btn type="submit" color="primary" :loading="loading">GO</v-btn>
        </v-form>
      </v-sheet>
    </v-card-text>
  </v-card>

  <v-expansion-panels>
  <v-expansion-panel>
    <v-expansion-panel-title class="pa-5"
      ><u> Other options </u></v-expansion-panel-title
    >
    <v-expansion-panel-text class="pa-5">
      <p>Fourier masks (COMING SOON - currently just pixel scan)</p>
      <p>
        PGA - digital gain (ADC x1, x2, x4, x8) - amplifies the signal from the "black level"
        upwards, but would clip at larger ranges (higher contrast).
        See device settings.
      </p>
      <p>
        SPS - samples per second (ADC 15SPS, 30SPS, 60SPS, 240SPS) - runs faster, but reduces
        brightness level precision from 60,000 levels at 15SPS down to 4,000 levels at 240SPS.
        See device settings.
      </p>
      <p>SPP - samples per pixel (averaging to smooth out noise, but will run slower)</p>
      <p>
        <u> Hardware controls </u>
      </p>
      <p>
        Analogue gain - initial amplification of light brightness level from the sensor (includes
        any electrical noise).
      </p>
      <p>
        Brightness offset - sets the "black level" to digitally amplify from. Facilitates daylight
        photos.
      </p>
    </v-expansion-panel-text>
  </v-expansion-panel>
  </v-expansion-panels>

</template>
