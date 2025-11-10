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
const cam = ref({ brightness: 0 })

// Events
// const emit = defineEmits(["newJobCreated"]);
onMounted(async () => {
  cam.value = cameraStore.camera()
})

// Methods
const createJob = async () => {
  try {
    const payload = {
      job: 'adc.config.read',
      state: 'requested',
      camera: cameraStore.cameraId,
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
  <v-card class="my-5">
    <v-card-title>Query the device for the configuration (read from ADC chip)</v-card-title>
    <v-card-text>
      <form @submit.prevent="createJob">
        <v-btn type="submit" color="primary">
          GO
        </v-btn>
      </form>
    </v-card-text>
  </v-card>

  <v-card class="my-5">
    <v-card-title> Current Config </v-card-title>
    <v-card-text>
      <p>Digital Gain: {{ cam.ADC_PGA }},</p>
      <p>Samples per second: {{ cam.ADC_SPS }},</p>
      <p>Black Offset: {{ cam.ADC_VINNEG }}</p>
    </v-card-text>
  </v-card>

  <ADCParameterExplanation />
</template>
