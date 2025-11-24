<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import Image from "@/components/Image.vue"
import pb from '@/lib/pocketbase'
import GalleryImage from '@/components/GalleryImage.vue'

// Local reactive variables
const images = ref<any[]>([])
const layout = ref('1')

const getList = async () => {
  try {
    const list = await pb.collection("images").getFullList(200, {
      sort: "-created",
    });
    if (list) {
      images.value = list;
    }
  } catch (error) {
    console.log(error);
  }
};

const subscribe = async () => {
  await pb.realtime.subscribe("images", async function (e) {
    await getList();
  });
};

const unsubscribe = async () => {
  await pb.realtime.unsubscribe("images");
};

onMounted(async () => {
  await getList();
  await subscribe();
});

onUnmounted(async () => {
  await unsubscribe();
});
</script>

<template>
  <div>
    <h1 >Image Gallery</h1>
    <v-btn-toggle v-model="layout">
      <v-btn>
        <v-icon>mdi-format-align-left</v-icon>
      </v-btn>

      <v-btn>
        <v-icon>mdi-grid</v-icon>
      </v-btn>
    </v-btn-toggle>

    <div v-if="layout == 0 && images" >
      <div
        v-for="image in images"
        v-bind:key="image.id"
      >
        <Image :image-data="image" />
      </div>
    </div>
    <v-container v-if="layout == 1 && images" >
    <v-row>

      <v-col
        v-for="image in images"
        v-bind:key="image.id"
        class="ma-1 pa-0"
      >
        <GalleryImage :image-data="image" />
      </v-col>
    </v-row>
    </v-container>
  </div>
</template>
