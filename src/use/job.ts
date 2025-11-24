import { ref } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"

export const useJobStore = defineStore("job", () => {
  const jobId = ref(useLocalStorage("jobId", ""))
  const job = ref(useLocalStorage("job", {}))

  function clear() {
    jobId.value = ""
    job.value = {}
  }

  function setJob(j){
    console.log('useJob.setJob', { j })
    job.value = j
    //jobId.value = j.id
  }

  return { jobId, job, setJob, clear }
})
