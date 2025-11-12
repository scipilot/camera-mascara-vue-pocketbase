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

  // interesting - if we update the "current camera" this needs to be spliced into the existing list
  function setCamera(nc){
    console.log('useCamera.setCamera', { nc })
    cameras.value.splice(cameras.value.findIndex(c => c.id == cameraId.value), 1, nc)
  }

  return { cameraId, camera, cameras, updateCameras, setCamera, clear }
})
