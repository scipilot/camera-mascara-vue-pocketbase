import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const userID = ref(useLocalStorage("userID", ""))
  const username = ref(useLocalStorage("username", ""))
  const userProfileID = ref(useLocalStorage("userProfileID", ""))

  // Actions
  function clear() {
    userID.value = ""
    username.value = ""
    userProfileID.value = ""
  }

  return { userID, username, userProfileID, clear }
})
