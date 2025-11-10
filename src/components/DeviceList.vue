<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import {useCameraStore} from '@/use/camera'
import pb from '@/lib/pocketbase'

// Events
const emit = defineEmits(["cameraChosen", "camerasLoaded"]);

// State
const cameraStore = useCameraStore()

// Methods
const getCamerasList = async () => {
	try {
		const list = await pb.collection("cameras").getFullList(200, {
			'expand': 'job',
		});
		if (list) {
			cameraStore.cameras = list;
			emit("camerasLoaded");
		}
	}
	catch (error) {
		console.log("Camera List - Get cameras list", {error});
	}
};

const subscribeToAll = async () => {
	await pb.realtime.subscribe("cameras", async function (e) {
		await getCamerasList();
	});
};
const unsubscribeToAll = async () => {
	await pb.realtime.unsubscribe("cameras");
};

onMounted(async () => {
	await getCamerasList();
	await subscribeToAll();
});
onUnmounted(async () => {
	await unsubscribeToAll();
});

const onClickCam = () => {
	emit("cameraChosen"); // todo can't they watch the store?
}
</script>

<template>
	<v-select v-model="cameraStore.cameraId" @change="onClickCam"
	          :items="cameraStore.cameras"
            item-title="name"
            item-value="id"
            label="Select"
  >
	</v-select>
</template>
