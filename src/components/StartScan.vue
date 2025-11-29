<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/use/user'
import { useCameraStore } from '@/use/camera'
import { useJobStore } from '@/use/job.ts'
import { createJob } from '@/lib/pocketbase/job.ts'
import CurrentJobPanel from '@/components/CurrentJobPanel.vue'
import { subscribeDevice, unsubscribeDevice } from '@/lib/pocketbase/device.ts'
import type { CameraDTO } from '@/lib/types/camera.ts'
import type { JobDTO } from '@/lib/types/job.ts'

// Compose
const userStore = useUserStore()
const cameraStore = useCameraStore()
const jobStore = useJobStore()

// Events
// const emit = defineEmits(['JobCreated'])

// State
const title = ref('')
// the radios need string values
const mask_type = ref('point')
const image_size = ref('64')
// const mask_pixel_scan = ref('32') // REMOVED not useful? - (scans a subsection/window of the image).
const mask_point_size = ref('2')
const mask_point_shape = ref('square')
const loading = ref(false)

const pointImageSizes = ["4", "16", "32", "64", "128", "256"]
// const pixelScans = ["4", "16", "32", "64", "128"]
const fourierImageSizes = ["32", "64", "128"]
const image_sizes = ref(computed(() => (mask_type.value == 'point' ? pointImageSizes : fourierImageSizes)))
const point_sizes = ref(computed(() => (mask_point_shape.value == 'square' ? pointSizesSquare : pointSizesGaussian)))

const pointSizesSquare = ["1", "2", "4", "8"]
const pointSizeCombosSquare = {
  "4":   ["1"],
  "16":  ["2"],
  "32":  ["2", "4"],
  "64":  ["2", "4", "8"],
  "128": ["4", "8"],
}
const pointSizesGaussian = ["3", "5", "9", "15", "33", "49", "99"]
const pointSizeCombosGaussian = {
  "16":  ["3", "5"],
  "32":  ["3", "5", "9", "15"],
  "64":  ["9", "15", "33"],
  "128": ["9", "15", "33", "65"],
  "256": ["15", "33"],
}

// Events
onUnmounted(async () => {
  await unsubscribeDevice(cameraStore.cameraId)
})

// Methods
function available(image_size: string, mask_point_shape: string, mask_pixel_size: string) {
  if(mask_point_shape == "square") return pointSizeCombosSquare[image_size].includes(mask_pixel_size)
  if(mask_point_shape == "gaussian") return pointSizeCombosGaussian[image_size].includes(mask_pixel_size)
}

async function doCreateJob() {
  loading.value = true
  const payload = {
    title: title.value,
    mask_type: mask_type.value,
    image_size: image_size.value,
    mask_point_size: mask_point_size.value,
    mask_point_shape: mask_point_shape.value,
    // mask_pixel_scan: mask_pixel_scan.value,
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
  await subscribeDevice(cameraStore.cameraId, setCameraWrapper)
}
async function setJobWrapper(j:JobDTO) {
  // console.log('SS setJobWrapper', { j })
  jobStore.setJob(j)
  if (!j) {
    loading.value = false
    await unsubscribeDevice(cameraStore.cameraId)
  }
}
function setCameraWrapper(cam:CameraDTO) {
  // console.log("setCameraWrapper", {cam})
  cameraStore.setCamera(cam)
}
</script>

<template>
  <v-card v-if="cameraStore.camera().job">
    <CurrentJobPanel />
  </v-card>

  <v-card class="my-5">
    <v-card-title class="pa-5">Create new image</v-card-title>
    <v-card-text class="pa-5">
      <v-sheet class="mx-auto">
        <v-form @submit.prevent="doCreateJob" v-if="!cameraStore.camera().job">
          <div>
            <p>Mask Type</p>
            <v-radio-group v-model="mask_type" inline>
              <v-radio value="point" label="Point Scan" />
              <v-radio value="fourier" label="Fourier" />
              <v-radio value="hadamard" label="Hadamard" disabled />
            </v-radio-group>
          </div>
          <div>
            <p>Image Resolution</p>
            <v-radio-group v-model="image_size" inline>
              <v-radio v-for="size in image_sizes" :label="size" :value="size" v-bind:key="size" />
            </v-radio-group>
          </div>
<!--
          <div>
            <p :class="mask_type == 'point' ? '' : 'text-grey-darken-2'">Mask Point scan resolution</p>
            <v-radio-group v-model="mask_pixel_scan" inline :disabled="!(mask_type == 'point')">
              <v-radio v-for="size in pixelScans" :label="size" :value="size" v-bind:key="size" />
            </v-radio-group>
          </div>
-->
          <div>
            <p :class="mask_type == 'point' ? '' : 'text-grey-darken-2'">Mask Point Size</p>
            <v-radio-group v-model="mask_point_size" inline :disabled="!(mask_type == 'point')">
              <v-radio v-for="size in point_sizes" :key="size" :value="size" :label="size"
                :disabled="!available(image_size, mask_point_shape, size) || !(mask_type == 'point')"
              />
            </v-radio-group>
          </div>
          <div>
            <p :class="mask_type == 'point' ? '' : 'text-grey-darken-2'">Mask Point Shape</p>
            <v-radio-group v-model="mask_point_shape" inline :disabled="!(mask_type == 'point')">
              <v-radio
                value="square"
                label="Square"
              />
              <v-radio
                value="gaussian"
                label="Gaussian"
              />
            </v-radio-group>
          </div>
          <label>
            <span>Title</span>
            <v-text-field v-model="title" placeholder="(leave blank for auto name)" />
          </label>
          <v-btn type="submit" color="primary" :loading="loading">GO</v-btn>
        </v-form>

        <v-expansion-panels class="my-5">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon icon="mdi-information" class="pr-5"></v-icon>
              Notes
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p class="my-3">
                Make sure the projector and subject is ready before taking the photo! You can use
                the light-meter to ensure you get the right light levels. Also see the device
                options for brightness and amplification controls.
              </p>
              <p class="my-3">
                Not all single-pixel combinations are available. Try these: 1x1+4x4 2x2+16x16
                2x2+32x32 2x2+64x64 4x4+128x128 4x4+32x32 4x4+64x64 6x6+64x64 8x8+64x64 8x8+128x128x
              </p>
              <p class="my-3">Fourier images are 1/2 the size of the mask.</p>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-sheet>
    </v-card-text>
  </v-card>

  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title class="pa-5"><u> Other options... </u></v-expansion-panel-title>
      <v-expansion-panel-text class="pa-5">
        <p>Fourier masks (COMING SOON - currently just pixel scan)</p>
        <p>
          PGA - digital gain (ADC x1, x2, x4, x8) - amplifies the signal from the "black level"
          upwards, but would clip at larger ranges (higher contrast). See device settings.
        </p>
        <p>
          SPS - samples per second (ADC 15SPS, 30SPS, 60SPS, 240SPS) - runs faster, but reduces
          brightness level precision from 60,000 levels at 15SPS down to 4,000 levels at 240SPS. See
          device settings.
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
