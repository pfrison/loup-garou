<script setup lang="ts">
import { ref } from "vue";
import { callApi } from "@/scripts/api";

const props = defineProps<{
    message: string,
    hasErrorMessage: boolean
}>();

const emit = defineEmits(["onLogin", "onError", "onLinkClick"]);

const isLoginInProgress = ref(false);
const username = ref("");
const password = ref("");

function doLogin(): void {
    // sanitize
    let errorSanitize = sanitizeCheck(username.value);
    if ( errorSanitize ) {
        alert("Username " + errorSanitize);
        return;
    }
    errorSanitize = sanitizeCheck(password.value);
    if ( errorSanitize ) {
        alert("Password " + errorSanitize);
        return;
    }

    // send request
    isLoginInProgress.value = true;
    callApi("POST", "/login", {
        username: username.value,
        password: password.value
    }, () => {
        emit("onLogin", username.value);
    }, (errorCode: number) => {
        emit("onError", errorCode);
    }, () => {
        isLoginInProgress.value = false;
    });
}

function sanitizeCheck(text: string): string | undefined {
    if ( text.length <= 0 )
        return "must not be empty";
    if ( ! /^[a-zA-Z0-9]+$/.test(text) )
        return "must be alphanumric only";
    if ( text.length > 256 )
        return "must be less than 256 characters";
    return undefined;
}

function linkClick() {
    emit("onLinkClick");
}
</script>

<template>
    <form @submit.prevent="doLogin">
        <div class="loginBox">
            <h1 class="title centerText">Loup Garou</h1>
            <h2 class="subtitle centerText">Activ'IT project 2024</h2>
            <p class="centerText message" :class="{
                    invisible: !message,
                    errorMessage: hasErrorMessage,
                    okMessage: !hasErrorMessage
                }">
                    {{ message ? message : "blank" }}
                </p>
            <ui-textfield required v-model="username" class="textField">Username</ui-textfield>
            <ui-textfield required input-type="password" v-model="password" class="textField">Password</ui-textfield>
            <ui-button raised id="login" class="spaceUp" :disabled="isLoginInProgress" @click="doLogin">Login</ui-button>
            <a class="centerText" href="#" @click="linkClick">New user ? Register here</a>
        </div>
    </form>
</template>

<style scoped>
.loginBox {
    padding: 50px;
    background-color: #F0F0F0;
    display: grid;
}
.centerText {
    justify-content: center;
    display: flex;
}
.title {
    padding: 0;
    margin: 0;
}
.subtitle {
    padding: 0;
    margin: 0;
}
button {
    width: 100%;
    height: 40px;
    vertical-align: middle;
    text-transform: uppercase;
    font-weight: bold;
    font-size: large;
}
.spaceUp {
    margin-top: 20px;
}
a, p {
    font-size: 1.8vmin;
}
h1 {
    font-size: 8vmin;
}
h2 {
    font-size: 4vmin;
}
.message {
    margin-top: 0;
}
.errorMessage {
    color: #ce3a3a;
}
.okMessage {
    color: #3c703c;
}
.invisible {
    visibility: hidden;
}
.textField {
    width: 100%;
}
</style>
