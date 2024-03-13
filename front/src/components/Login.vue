<script setup lang="ts">
import { ref } from "vue";
import { callApi } from "@/scripts/api";

const emit = defineEmits(["onLogin"]);

const loginIn = ref(false);
const username = ref("");
const password = ref("");

function doLogin(): void {
    console.log("Username : " + username.value);
    console.log("Password : " + password.value);
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
    loginIn.value = true;
    callApi("POST", "/login", {
        username: username.value,
        password: password.value
    }, (json: any) => emit("onLogin", { username: username.value, sessionId: json.sessionId }),
    (errorCode: number) => {
        if ( errorCode === 403 )
            alert("Wrong username or password");
        else
            alert("Unexpected error from the server");
    }, () => loginIn.value = false);
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
</script>

<template>
    <form @submit.prevent="doLogin">
        <table class="loginBox">
            <tr>
                <td colspan="2">
                    <h1 class="title centerText">Loup Garou</h1>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <h2 class="subtitle centerText">Activ'IT project 2024</h2>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="username">Username</label>
                </td>
                <td>
                    <input required id="username" type="text" v-model="username" />
                </td>
            </tr>
            <tr>
                <td>
                    <label for="password">Password</label>
                </td>
                <td>
                    <input required id="password" type="password" v-model="password" />
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <button id="login" class="spaceUp" :disabled="loginIn">Login</button>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <a class="centerText" href="#">New user ? Register here</a>
                </td>
            </tr>
        </table>
    </form>
</template>

<style scoped>
.loginBox {
    padding: 50px;
    border: 2px solid black;
    border-radius: 20px;
    border-color: black;
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
    margin-top: 0;
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
</style>
