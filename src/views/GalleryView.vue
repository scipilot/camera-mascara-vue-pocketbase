<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import Image from "@/components/Image.vue"
import pb from '@/lib/pocketbase'

// Local reactive variables
const images = ref<any[]>([])

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
    <div v-if="images" >
      <div
        v-for="image in images"
        v-bind:key="image.id"
      >
        <Image :image-data="image" />
      </div>
    </div>
  </div>
</template>
