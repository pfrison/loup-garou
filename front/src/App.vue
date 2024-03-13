<script setup lang="ts">
import { ref } from "vue";
import Login from "./components/Login.vue";
import Page from "./components/Page.vue";

const sessionId = ref(undefined);
</script>

<template>
    <Login v-if="!sessionId" class="centered" @onLogin="(msg) => sessionId = msg"/>
    <Page v-else :sessionId="sessionId" />
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
