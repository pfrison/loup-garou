<script setup lang="ts">
import { ref, onMounted, provide, inject } from "vue";
import Login from "./components/login/Login.vue";
import Page from "./components/Page.vue";
import { callApi } from "./scripts/api";
import { Injects } from "./scripts/consts";

const username = ref("");
const authError = ref(false);
const loginVerification = ref(false);
provide(Injects.USERNAME, username);

onMounted(() => {
    // Test credentials
    loginVerification.value = true;
    callApi("GET", "/isAuth", undefined,
        (json: any) => username.value = json.username, // success
        () => { localStorage.auth = ""; authError.value = true; }, // fail
        () => loginVerification.value = false); // finally
});

function onLogin(username_: string): void {
    username.value = username_;
}

function onAuthError() {
    authError.value = true;
    username.value = "";
}
</script>

<template>
    <div v-if="loginVerification">
        <span>Loading...</span>
    </div>
    <Page v-else-if="username" @onAuthError="onAuthError"/>
    <Login v-else class="centered" @onLogin="onLogin" :authError="authError"/>
</template>

<style scoped>
.centered {
    margin: 0 auto;
    min-height: 85vh; 
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
