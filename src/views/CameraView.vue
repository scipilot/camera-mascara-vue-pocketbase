<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/use/user'
import pb from '@/lib/pocketbase'
import StartScan from '@/components/StartScan.vue'

const userStore = useUserStore()

// State
const jobs = ref<any[]>([])

const getOwnedJobList = async () => {
    try {
        const list = await pb.collection("jobs").getFullList(10, {
            filter: `user = '${userStore.userID}'`,
            expand: "user"
        })
        if (list) {
            jobs.value = list
        }
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    getOwnedJobList()
})

</script>

<template>
    <div>
        <h1 >Camera</h1>
        <div v-if="jobs" >
            <StartScan @new-post-created="getOwnedJobList" />
        </div>
    </div>
</template>
