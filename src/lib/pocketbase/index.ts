import PocketBase from 'pocketbase'

export default new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

export const URL = import.meta.env.VITE_POCKETBASE_URL
