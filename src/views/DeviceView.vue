<script setup lang="ts">
import DeviceList from '@/components/DeviceList.vue'
import DeviceDetails from '@/components/DeviceDetails.vue'
</script>

<template>
  <h1 >Pi Devices</h1>

  <DeviceList />

  <DeviceDetails />

  <v-card class="my-3">
    <v-card-title>Options:</v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item>
          <router-link to="/device/query"> Query device... </router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/device/write"> Update device... </router-link>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
