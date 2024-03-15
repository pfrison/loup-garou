<script setup lang="ts">
import { ref } from "vue";
import { callApi } from "@/scripts/api";

const props = defineProps<{
    authError: boolean
}>();

const emit = defineEmits(["onLogin"]);

const register = ref(false);
const loginIn = ref(false);
const username = ref("");
const password = ref("");
const messageState = ref(props.authError ? -1 : 0);

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
    callApi("POST", register.value ? "/register" : "/login", {
        username: username.value,
        password: password.value
    }, (json: any) => {
        if ( register.value ) {
            switchRegister();
            messageState.value = 1;
        } else {
            emit("onLogin", { username: username.value, sessionId: json.sessionId });
        }
    }, (errorCode: number) => {
        if ( errorCode === 403 )
            alert(register.value ? "Username already exist" : "Wrong username or password");
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

function switchRegister() {
    register.value = !register.value;
    username.value = "";
    password.value = "";
}
</script>

<template>
    <form @submit.prevent="doLogin">
        <table class="loginBox">
            <tr>
                <td>
                    <h1 class="title centerText">Loup Garou</h1>
                </td>
            </tr>
            <tr>
                <td>
                    <h2 class="subtitle centerText">Activ'IT project 2024</h2>
                </td>
            </tr>
            <tr>
                <td>
                    <p class="centerText message" :class="{
                            invisible: messageState === 0,
                            errorMessage: messageState < 0,
                            okMessage: messageState > 0
                        }">
                            {{
                                messageState === -1 ? "You have been logged out" :
                                messageState === 1  ? "Successfully registered ! Please login" :
                                "No error"
                            }}
                        </p>
                </td>
            </tr>
            <tr>
                <td>
                    <ui-textfield required v-model="username" style="width: 100%;">Username</ui-textfield>
                </td>
            </tr>
            <tr>
                <td>
                    <ui-textfield required input-type="password" v-model="password" style="width: 100%;">Password</ui-textfield>
                </td>
            </tr>
            <tr>
                <td>
                    <ui-button raised id="login" class="spaceUp" :disabled="loginIn" @click="doLogin">{{ register ? "Register" : "Login" }}</ui-button>
                </td>
            </tr>
            <tr>
                <td>
                    <a class="centerText" href="#" @click="switchRegister">{{ register ? "Have an account ? Login here" : "New user ? Register here" }}</a>
                </td>
            </tr>
        </table>
    </form>
</template>

<style scoped>
.loginBox {
    padding: 50px;
    background-color: #F0F0F0;
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
</style>
