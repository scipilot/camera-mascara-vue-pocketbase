<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../use/user'
import pb from '../lib/pocketbase'

const router = useRouter()
const userStore = useUserStore()

const email = ref("public@raspberrypi.local");
const password = ref("password");

const authUser = async () => {
    try {
        const userData = await pb.collection("users").authWithPassword(email.value, password.value);

        if (userData) {
            userStore.userID = userData.record.id;
            userStore.username = userData.record.profile?.username;
            userStore.userProfileID = userData.record.profile?.id!;
            router.push({ path: "/gallery" })
        }
    } catch (error) {
        console.log(error)
    }
}
</script>

<template>
    <h2>
        Login
    </h2>
    <v-form @submit.prevent="authUser">
        <div >
            <label>
                <span>Email</span>
                <v-text-field type="email"  v-model="email"/>
            </label>
            <label>
                <span>Password</span>
                <v-text-field type="password"  v-model="password"/>
            </label>
        </div>
        <button type="submit">
            Login
            </button>
    </v-form>
</template>
