import { ref, Ref } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import type { JobDTO } from '@/lib/types/job.ts'

export const useJobStore = defineStore("job", () => {
  const jobId = ref(useLocalStorage("jobId", ""))
  const job:Ref<JobDTO|undefined> = ref(useLocalStorage("job", undefined))

  function clear() {
    jobId.value = ""
    job.value = undefined
  }

  function setJob(j:JobDTO){
    console.log('useJob.setJob', { j })
    job.value = j
    //jobId.value = j.id
  }

  return { jobId, job, setJob, clear }
})
