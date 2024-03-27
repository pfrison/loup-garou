<script setup lang="ts">
import { ref } from "vue";
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";

const props = defineProps<{
    authError: boolean
}>();

const emit = defineEmits(["onLogin"]);

const isRegister = ref(false);
const message = ref("");
const hasErrorMessage = ref(false);

if ( props.authError ) {
    message.value = "You have been logged out";
    hasErrorMessage.value = true;
}

function switchIsRegister() {
    isRegister.value = !isRegister.value;
    message.value = "";
    hasErrorMessage.value = false;
}

function loginSuccess(username: string) {
    emit("onLogin", username);
}

function registerSuccess() {
    switchIsRegister();
    message.value = "Successfully registered ! Please login";
    hasErrorMessage.value = false;
}

function loginError(errorCode: number) {
    if ( errorCode === 403 )
        alert("Wrong username or password");
    else
        alert("Unexpected error from the server");
}

function RegisterError(errorCode: number) {
    if ( errorCode === 403 )
        alert("Username already exist");
    else
        alert("Unexpected error from the server");
}
</script>

<template>
    <RegisterForm v-if="isRegister" @on-link-click="switchIsRegister" @on-register="registerSuccess" @on-error="RegisterError"/>
    <LoginForm v-else :message="message" :has-error-message="hasErrorMessage" @on-link-click="switchIsRegister" @on-login="loginSuccess" @on-error="loginError"/>
</template>

<style scoped>
</style>
