<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/use/user'
import { useCameraStore } from '@/use/camera'
import ADCParameterExplanation from '@/components/ADCParameterExplanation.vue'
import pb from '@/lib/pocketbase'

// Compose
const cameraStore = useCameraStore()
const userStore = useUserStore()

// State
// const title = ref("");
const cam = ref({ brightness: 0 })
const pga = ref(0)
const sps = ref(0)

// Events
// const emit = defineEmits(["newJobCreated"]);
onMounted(async () => {
  cam.value = cameraStore.camera()
  pga.value = cam.value.ADC_PGA
  sps.value = cam.value.ADC_SPS
})

// Methods
const createJob = async () => {
  try {
    const payload = {
      job: 'adc.config.write',
      state: 'requested',
      camera: cameraStore.cameraId,
      pga: pga.value,
      sps: sps.value,
      user: userStore.userID,
      userdata: userStore.userProfileID,
    }
    const response = await pb.collection('jobs').create(payload)
    if (response) {
      // emit("newJobCreated");
    }
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <v-card>
    <v-card-title>Update the device configuration (write to ADC chip)</v-card-title>
    <v-card-text>
      <form @submit.prevent="createJob">

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
            <v-col cols="5">
            Samples per second: (currently {{ cam.ADC_SPS }})
            </v-col>
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
        <v-btn type="submit" color="primary">
          GO
        </v-btn>
      </form>
    </v-card-text>
  </v-card>

  <ADCParameterExplanation />
</template>
