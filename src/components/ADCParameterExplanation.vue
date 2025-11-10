<script setup lang="ts">
</script>

<template>
	<v-card class="my-5">

		<v-card-title>
		  Explanation of device settings
		</v-card-title>
		<v-card-text>

		<p>
			PGA - digital gain (ADC x1, x2, x4, x8) - amplifies the signal from the
			"black level" upwards, but would clip at larger ranges (higher contrast).
		</p>
		<p>
			SPS - samples per second (ADC 15SPS, 30SPS, 60SPS, 240SPS) - runs faster,
			but reduces brightness level precision from 60,000 levels at 15SPS down to
			4,000 levels at 240SPS.
		</p>
    </v-card-text>
  </v-card>
</template>
