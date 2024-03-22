<script setup lang="ts">
import { ref, onMounted } from "vue";
import Login from "./components/Login.vue";
import Page from "./components/Page.vue";
import { callApi, type Auth } from "./scripts/api";

const auth = ref({
    username: "",
    sessionId: ""
});
const authError = ref(false);
const loginVerification = ref(false);

onMounted(() => {
    // Test credentials if any
    if ( localStorage.auth ) {
        loginVerification.value = true;
        const authToTest: Auth = JSON.parse(localStorage.auth);
        callApi("GET", "/isAuth", undefined,
            () => auth.value = authToTest, // success
            () => { localStorage.auth = ""; authError.value = true; }, // fail
            () => loginVerification.value = false, // finally
            authToTest);
    }
});

function onLogin(msg: Auth): void {
    auth.value = msg;
    localStorage.auth = JSON.stringify(msg)
}

function onAuthError() {
    localStorage.auth = "";
    authError.value = true;
    auth.value = {
        username: "",
        sessionId: ""
    }
}
</script>

<template>
    <div v-if="loginVerification">
        <span>Loading...</span>
    </div>
    <Page v-else-if="auth.sessionId" :auth="auth" @onAuthError="onAuthError"/>
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
