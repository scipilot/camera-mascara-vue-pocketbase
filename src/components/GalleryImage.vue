<script setup lang="ts">
/**
 * This is a full-size, gallery grid image, showing the photo large with no text.
 */
import { URL } from '@/lib/pocketbase'
import { ref } from 'vue'

const props = defineProps({
  imageData: Object,
})

const overlay = ref(false)

</script>

<template>

  <v-card class="ma-0 pa-0">
    <v-card-text class="ma-0 pa-0">

      <v-img :src="URL + '/api/files/images/' + props.imageData?.id + '/' + props.imageData?.image"
             :width="200"
             @click="overlay = !overlay"
      />


    </v-card-text>
  </v-card>

  <v-overlay
    :model-value="overlay"
    class="align-center justify-center"
  >
    <v-img :src="URL + '/api/files/images/' + props.imageData?.id + '/' + props.imageData?.image"
           :width="500"
    />
    <p >{{ props.imageData?.title }}</p>

  </v-overlay>

</template>
