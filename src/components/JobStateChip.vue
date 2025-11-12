<script setup lang="ts">
import { computed } from 'vue'
import { useJobStore } from '@/use/job.ts'

const jobStore = useJobStore()

const state = computed(()=>{
  console.log('JobChip.compute state', {job: jobStore.job, state:jobStore.job.state})
  if(jobStore.job) return jobStore.job.state
  else return null
})

</script>

<template>
  <v-chip v-if="state=='requested'">Requested...</v-chip>
  <v-chip v-if="state=='pending'">Pending...</v-chip>
  <v-chip v-if="state=='starting'">Starting...</v-chip>
  <v-chip v-if="state=='running'">Running...</v-chip>
  <v-chip v-if="state=='ended'">Ended</v-chip>
</template>
