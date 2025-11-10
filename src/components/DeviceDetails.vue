<script setup lang="ts">
import {useCameraStore} from '@/use/camera'

const cameraStore = useCameraStore()

</script>

<template>
<v-card v-if="cameraStore.camera()">

		<v-card-title>
			{{ cameraStore.camera().name }} - details
		</v-card-title>
		<v-card-text>

		<p>
			Activity:
			<span v-if="!cameraStore.camera().job">idle</span>
			<span v-else>
					{{ cameraStore.camera().job}} -
					{{ cameraStore.camera().expand.job.job }} -
					{{ cameraStore.camera().expand.job.state }} -
					since {{ cameraStore.camera().expand.job.created }} -
				</span>
		</p>
		<p>
			Last brightness: {{ cameraStore.camera().brightness.toFixed(3) }} V
		</p>
		<p>
			Configuration (
			PGA: {{ cameraStore.camera().ADC_PGA }},
			SPS: {{ cameraStore.camera().ADC_SPS }},
			VINNEG: {{ cameraStore.camera().ADC_VINNEG }},
			SPP: {{ cameraStore.camera().SPP }}
			)
		</p>
    </v-card-text>
</v-card>
</template>
