<script setup lang="ts">
import { ref, onMounted, provide, inject } from "vue";
import Login from "./components/login/Login.vue";
import Page from "./components/Page.vue";
import { callApi } from "./scripts/api";
import { Injects } from "./scripts/consts";
import WaitingCircle from "./components/shared/WaitingCircle.vue"

const username = ref("");
const authError = ref(false);
const loginVerification = ref(false);
provide(Injects.USERNAME, username);

onMounted(() => {
    // Test credentials
    loginVerification.value = true;
    callApi("GET", "/isAuth", undefined,
        (json: any) => username.value = json.username, // success
        () => authError.value = true, // fail
        () => loginVerification.value = false); // finally
});

function onLogin(username_: string): void {
    username.value = username_;
}

function onAuthError() {
    authError.value = true;
    username.value = "";
}

function onDisconnect() {
    authError.value = false;
    username.value = "";
}
</script>

<template>
    <WaitingCircle v-if="loginVerification" :message="'Authentification attempt in progress...'" />
    <Page v-else-if="username" @onAuthError="onAuthError" @on-disconnect="onDisconnect" />
    <Login v-else class="centered" @onLogin="onLogin" :authError="authError" />
</template>

<style scoped>
.centered {
    margin: 0 auto;
    min-height: 85vh; 
    display: flex;
    justify-content: center;
    align-items: center;
}
.grid {
    display: grid;
}
.marginAuto{
    margin: auto;
}
</style>
