export type ImageDTO = {
  id:string
  created: Date
  title: string
  stats: string
  data: Blob
  image: Blob
  clip : ["both", "hi", "lo", "no"]
}
