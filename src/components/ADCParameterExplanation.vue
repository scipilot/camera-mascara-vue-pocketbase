<script setup lang="ts"></script>

<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
      <v-icon icon="mdi-help-circle" class="pr-5"></v-icon>
      Explanation of device settings
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <p>
          <b>PGA</b> - digital gain ( x1, x2, x4, x8) - amplifies the signal from the "black level"
          upwards, but reduces the range so would saturate more easily at higher amplifications
          (higher contrast).
        </p>
        <p>
          <b>SPS</b> - samples per second ( 15, 30, 60, 240) - higher speed will scan faster but reduces
          brightness level precision across the range from 60,000 levels at 15 SPS down to 4,000
          levels at 240 SPS. The lower levels may cause gradient banding artefacts.
        </p>

        <p>
          <b>Black level</b>
           - this is the level of brightness to be considered "black" in the image. In
          higher background light or projector bleed, it's possible to increase this setting to
          offset the ambient light. Doing this would enable a higher gain (amplification), while
          avoiding potential saturation. Currently this is a physical dial on the device (i.e. not
          an digital control in the app).
        </p>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
