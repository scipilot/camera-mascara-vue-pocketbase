import { ref } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"

export const useCameraStore = defineStore("camera", () => {
  const cameraId = ref(useLocalStorage("cameraId", ""))
  const cameras = ref(useLocalStorage("cameras", []))

  function clear() {
    cameraId.value = ""
    cameras.value = []
  }

  function camera() {
    return cameras.value.find((c) => c.id == cameraId.value)
  }

  function updateCameras(list){
    cameras.value = list
  }

  return { cameraId, camera, cameras, updateCameras, clear }
})
