<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref } from 'vue'
import VueSpeedometer from 'vue-speedometer'
import { useUserStore } from '@/use/user'
import { useCameraStore } from '@/use/camera' // https://www.npmjs.com/package/vue-speedometer
import pb from '@/lib/pocketbase'

// Compose
const cameraStore = useCameraStore()
const userStore = useUserStore()

// State
const cam = ref({ brightness: 0 })
const level = ref('0')
const min = ref(0)
const max = ref(4.0)
const updateSpeedo = ref(true)
const segments = ref(4)
const state = ref('')
let currentJobId = ''

const rangeByPGA = {
  // note also dependent on VINNEG as the centre point
  1: { range: 4, min: 0, max: 4 },
  2: { range: 2, min: 1, max: 3 },
  4: { range: 1, min: 1.5, max: 2.5 },
  8: { range: 0.5, min: 1.75, max: 2.25 },
}

onBeforeMount(async () => {
  cam.value = cameraStore.camera()
  configureSpeedo()
})
onUnmounted(async () => {
  // in case user leaves the page during a run
  onStopMeter(currentJobId)
})

async function onClickStart() {
  const jobId = await createJob()
  // listen to changes
  onStartMeter(jobId)
}
async function onStartMeter(jobId:string) {
  updateSpeedo.value = false
  // Subscribe to realtime changes to the recordId
  await pb.collection('cameras').subscribe(cameraStore.cameraId, getCamera, {})
  await pb.collection('jobs').subscribe(jobId, ()=>getJob(jobId), {})
  currentJobId = jobId
}
async function onStopMeter(jobId:string) {
  // Unsubscribe from all registered subscriptions to the recordId
  await pb.collection('cameras').unsubscribe(cameraStore.cameraId)
  if(jobId) await pb.collection('jobs').unsubscribe(jobId)
  currentJobId = null
}
async function getCamera() {
  try {
    const c = await pb?.collection('cameras').getOne(cameraStore.cameraId, {
      expand: 'job',
    })
    if (c) {
      cam.value = c
      level.value = c.brightness
      state.value = c.expand.job.state
      if (c.expand.job.state == 'ended') onStopMeter(c.expand.job.id)
    }
  } catch (error) {
    console.log('Meter - Get camera', { error })
  }
}
async function getJob(jobId:string) {
  try {
    const j = await pb?.collection('jobs').getOne(jobId, {})
    if (j) {
      state.value = j.state
      //if (j.state == 'ended') onStopMeter(jobId)
    }
  } catch (error) {
    console.log('Meter - Get job', { error })
  }
}

// I need to set the min/max props onBeforeMount, as it only reads them once
// force-render itself isn't dynamic, so this must be done once on page load
// Note: the force-render prop is required to update the speedo config, but this makes the needle flick back to 0 so it's unusable!
function configureSpeedo() {
  // console.log(`-${rangeByPGA[cam.value.ADC_PGA].range / 2} + ${cam.value.ADC_VINNEG}`)
  // console.log(`+${rangeByPGA[cam.value.ADC_PGA].range / 2} + ${cam.value.ADC_VINNEG}`)
  min.value = cam.value.ADC_VINNEG - rangeByPGA[cam.value.ADC_PGA].range / 2
  max.value = cam.value.ADC_VINNEG + rangeByPGA[cam.value.ADC_PGA].range / 2
  // console.log(`${min.value} -> ${max.value}`)
  segments.value = Math.ceil(max.value - min.value)
  updateSpeedo.value = false
}

async function createJob() {
  try {
    const payload = {
      job: 'meter',
      state: 'requested',
      user: userStore.userID,
      camera: cameraStore.cameraId,
    }
    const response = await pb?.collection('jobs').create(payload)
    if (response) {
      console.log(response)
      return response.id
      // emit("JobCreated");
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <v-card>
    <v-card-title>

    </v-card-title>

    <v-card-text>
      <div v-if="cameraStore.cameraId">
<!--
        <p>
          <b>{{ cameraStore.camera().name }}</b>
        </p>
-->
<!--
        <p>Current brightness: {{ cam.brightness.toFixed(3) }} V</p>
-->
<!--
        <p>
          Activity:
          <span v-if="!cam.job">idle</span>
          <span v-else>
            {{ cam.job }} - {{ cam.expand.job.job }} - {{ cam.expand.job.state }} - since
            {{ cam.expand.job.created }} -
          </span>
        </p>
-->
        <VueSpeedometer :value="level" :min-value="min" :max-value="max" :segments="segments" />

        <p v-if="!cam.job">
          <v-btn color="primary" @click="onClickStart"> START METER</v-btn> (for 30 seconds)
        </p>
        <v-chip v-if="state=='requested'">Requested...</v-chip>
        <v-chip v-if="state=='pending'">Pending...</v-chip>
        <v-chip v-if="state=='starting'">Starting...</v-chip>
        <v-chip v-if="state=='running'">Running...</v-chip>
        <v-chip v-if="state=='ended'">Ended</v-chip>
        <p>
          Config ( Digital Gain: {{ cam.ADC_PGA }}, Samples per second: {{ cam.ADC_SPS }}, Black
          Offset: {{ cam.ADC_VINNEG }}
          )
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>
