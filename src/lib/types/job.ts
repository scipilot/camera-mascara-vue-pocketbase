export type JobDTO = {
  id: string
  job: ["capture", "meter", "adc.config.read", "adc.config.write"]
  state: ["requested",  "pending",  "starting",  "running",  "ending",  "ended"]
  camera: string // Camera Device ID
  image_size: number
  mask_pixel_size: number
  mask_type: ["point", "fourier"]
}
