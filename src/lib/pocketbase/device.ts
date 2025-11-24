import pb from '@/lib/pocketbase/index.ts'


// Handles listening to a device and tracking its progress in the provided store until told to stop (unsubscribeDevice)
export async function subscribeDevice(deviceId:string, setDevice:Function) {
  console.log('Device.subscribe')
  await pb.collection('cameras').subscribe(deviceId, async function (e) {
    await getCamera(deviceId, setDevice)
  })
}

export const unsubscribeDevice = async (deviceId:string) => {
  console.log('Device.unsubscribe')
  await pb.realtime.unsubscribe('camera', deviceId)
}

async function getCamera(deviceId:string, setDevice:Function) {
  console.log('Device.getCamera')
  try {
    const c = await pb.collection('cameras').getOne(deviceId, {
      expand: 'job',
    })
    if (c) {
      await setDevice(c)

      // TODO I wondered if there could be a job related extension to this? (i.e. sub-during-job) or keep that separate in the caller?
      // NOTE API (pocketbase-subscriber.py) removes the "job" from the "camera" when it has ended, so we won't ever see the expanded job having "ended" state
      // if (c.expand.job) {
      //   state.value = c.expand.job.state
      //   if (c.expand.job.state == 'ended') unsubscribe()
      // } else {
      //   console.log('camera has no job')
      // }

    }
  } catch (error) {
    console.log('Device.GetCamera caught', { error })
  }
}
