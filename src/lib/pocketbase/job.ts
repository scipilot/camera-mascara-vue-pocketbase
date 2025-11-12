import pb from '@/lib/pocketbase/index.ts'

// Handles posting a job and then tracking its progress until it ends
// Updates the provided job store with the progress
export const createJob = async (jobName: string, userID: string, userProfileID: string, deviceId: string, params: object, setJob: Function) => {
  console.log('Job - createJob', { jobName, deviceId })
  try {
    const payload = {
      job: jobName,
      state: 'requested',
      camera: deviceId,
      user: userID,
      userdata: userProfileID,
      ...params
    }
    const response = await pb.collection('jobs').create(payload)
    if (response) {
      //setJob(response)
      await subscribe(response.id, setJob)
    }
  } catch (error) {
    console.log('Job.createJob caught', { userID, deviceId, jobName, error })
  }
}

async function subscribe(jobId: string, setJob: Function) {
  console.log('Job.subscribe', { jobId })
  await pb.collection('jobs').subscribe(jobId, () => getJob(jobId, setJob), {})
}
async function unsubscribe(jobId: string) {
  console.log('Job.unsubscribe', { jobId })
  if (jobId) await pb.collection('jobs').unsubscribe(jobId)
}

async function getJob(jobId: string, setJob: Function) {
  console.log('Job.getJob', { jobId })
  try {
    const j = await pb?.collection('jobs').getOne(jobId, {})
    if (j) {
      console.log('Job.getJob got', { j })
      if (j.state == 'ended') {
        await unsubscribe(jobId)
        setJob(null)
      }
      else setJob(j)
    }
  } catch (error) {
    console.error('Job.getJob caught', { jobId, error })
  }
}
