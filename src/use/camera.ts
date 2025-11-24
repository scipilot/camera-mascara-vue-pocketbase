import { ref } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import type { Camera } from '@/lib/types/camera.ts'

export const useCameraStore = defineStore("camera", () => {
  const cameraId = ref(useLocalStorage("cameraId", ""))
  const cameras = ref<Camera[]>(useLocalStorage("cameras", []))

  function clear() {
    cameraId.value = ""
    cameras.value = []
  }

  function camera() {
    return cameras.value.find((c:Camera) => c.id == cameraId.value)
  }

  function updateCameras(list:Camera[]) {
    cameras.value = list
  }

  // If we update the "current camera" it needs to be spliced into the existing list
  function setCamera(nc:Camera){
    // console.log('useCamera.setCamera', { nc })
    const i = cameras.value.findIndex((c:Camera) => c.id == cameraId.value)
    // cameras.value.splice(i, 1, nc)
    cameras.value[i] = nc
  }

  return { cameraId, camera, cameras, updateCameras, setCamera, clear }
})
