<script setup lang="ts">
import { URL } from '@/lib/pocketbase'
import { ref } from 'vue'

const props = defineProps({
  imageData: Object,
})

const overlay = ref(false)

</script>

<template>

  <v-card class="my-5">
    <v-card-title >{{ props.imageData?.title }}</v-card-title>
    <v-card-text>

      <v-img :src="URL + '/api/files/images/' + props.imageData?.id + '/' + props.imageData?.image"
             :width="50"
             @click="overlay = !overlay"
      />
    <p>{{ props.imageData?.stats }}</p>

  <p v-if="props.imageData?.clip == 'hi'"  prepend-icon="mdi-alert">
      <v-chip color="red" size="large" >
        Brightness level went above maximum!
      </v-chip>
        Perhaps turn down the gain or reduce projector brightness/contrast to avoid image saturation.
  </p>
  <p v-if="props.imageData?.clip == 'lo'" >
      <v-chip color="red" size="large" prepend-icon="mdi-alert">
        Brightness level went below minimum!
      </v-chip>
        Perhaps turn up the gain to see darkness, or increase black-level brightness.
  </p>
  <p v-if="props.imageData?.clip == 'both'" >
      <v-chip color="red" size="large"  prepend-icon="mdi-alert">
        Brightness level went beyond both top and bottom range!
      </v-chip>
        Perhaps turn down the gain and increase black-level brightness.
  </p>

    </v-card-text>
  </v-card>

  <v-overlay
    :model-value="overlay"
    class="align-center justify-center"
  >
    <v-img :src="URL + '/api/files/images/' + props.imageData?.id + '/' + props.imageData?.image"
           :width="500"
    />

  </v-overlay>

</template>
