<script setup lang="ts">
import {onMounted, onUnmounted} from 'vue'
import {useCameraStore} from '@/use/camera'
import pb from '@/lib/pocketbase'

// State
const cameraStore = useCameraStore()

// Methods
const getCamerasList = async () => {
	try {
		const list = await pb.collection("cameras").getFullList(200, {
			'expand': 'job',
		});
		if (list) {
			cameraStore.updateCameras(list)
		}
	}
	catch (error) {
		console.log("Camera List - Get cameras list", {error});
	}
};

const subscribeToAll = async () => {
	await pb.realtime.subscribe("cameras", async function (e) {
		await getCamerasList()
	});
};
const unsubscribeToAll = async () => {
	await pb.realtime.unsubscribe("cameras");
};

onMounted(async () => {
	await getCamerasList()
	await subscribeToAll()
})
onUnmounted(async () => {
	await unsubscribeToAll()
})

</script>

<template>
	<v-select v-model="cameraStore.cameraId"
	          :items="cameraStore.cameras"
            item-title="name"
            item-value="id"
            label="Select"
  >
	</v-select>
</template>
