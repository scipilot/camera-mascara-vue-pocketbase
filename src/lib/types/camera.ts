export type CameraDTO = {
  id: string,
  ADC_PGA: [1,2,4,8]
  ADC_SPS: [15,20,60,240]
  ADC_VINNEG: number
  SPP: number,
  brightness: number
  clip: ["no", "hi", "lo", "both"]
  created: Date
}

// Convert/normalise some cameralike object to a Camera type (like a Pocketbase response)
export function makeCamera(camObj:never){
  let c: CameraDTO

  // todo, parse, check and set defaults etc?
  c = {
    id: camObj["id"],
    ADC_PGA: camObj["ADC_PGA"],
    ADC_SPS: camObj["ADC_SPS"],
    ADC_VINNEG: camObj["ADC_VINNEG"],
    SPP: camObj["SPP"],
    brightness: camObj["brightness"],
    clip: camObj["clip"],
    created: camObj["created"],
  }

  return c
}
