<script setup lang="ts">
import { ref } from "vue";
import LogRegComp from "./LogRegComp.vue";
import type { Auth } from "@/scripts/api";

const props = defineProps<{
    authError: boolean
}>();

const emit = defineEmits(["onLogin"]);

const isRegister = ref(false);
const message = ref("");
const isErrorMessage = ref(false);

const getEndpoint   = (isRegister: boolean) => isRegister ? "/register"                    : "/login"                  ;
const getButtonText = (isRegister: boolean) => isRegister ? "Register"                     : "Login"                   ;
const getLinkText   = (isRegister: boolean) => isRegister ? "Have an account ? Login here" : "New user ? Register here";

if ( props.authError ) {
    message.value = "You have been logged out";
    isErrorMessage.value = true;
}

function switchRegister() {
    isRegister.value = !isRegister.value;
    message.value = "";
    isErrorMessage.value = false;
}

function logRegSuccess(auth: Auth) {
    if ( isRegister.value ) {
        switchRegister();
        message.value = "Successfully registered ! Please login";
        isErrorMessage.value = false;
    } else {
        emit("onLogin", auth);
    }
}

function logRegError(errorCode: number) {
    if ( errorCode === 403 )
        alert(isRegister.value ? "Username already exist" : "Wrong username or password");
    else
        alert("Unexpected error from the server");
}
</script>

<template>
    <LogRegComp :api-endpoint="getEndpoint(isRegister)" :button-text="getButtonText(isRegister)" :link-text="getLinkText(isRegister)"
            :message="message" :is-error-message="isErrorMessage"
            @on-link-click="switchRegister" @on-log-reg="logRegSuccess" @on-error="logRegError"/>
</template>

<style scoped>
</style>
