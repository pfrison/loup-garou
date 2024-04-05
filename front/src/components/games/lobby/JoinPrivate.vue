<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { gameIdPattern, type Game } from '@/scripts/games';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

const emit = defineEmits(["onAuthError", "onJoin", "onCancel"]);

const privateGameId = ref("");
const privateJoinInProgress = ref(false);

function joinPrivate(): void {
    let errorSanitize = sanitizeGameId(privateGameId.value);
    if ( errorSanitize ) {
        alert(errorSanitize);
        return;
    }
    privateJoinInProgress.value = true;
    callApi("GET", "/joinGame", {
        gameId: privateGameId.value
    }, () => {
        emit("onJoin", privateGameId.value);
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
        else if ( errorCode === 404 )
            alert("This game doesn't exist");
        else
            alert("Unexpected error from server, unable to join the game");
    }, () => {
        privateJoinInProgress.value = false;
    });
}

function sanitizeGameId(gameId: string): string | undefined {
    if ( !gameId )
        return "Game id is required";
    else if ( !gameIdPattern.test(gameId) )
        return "Game id must be in a form of xxx-xxxx-xxx";
    return undefined;
}
</script>

<template>
    <ui-button icon="arrow_back" class="backButton" @click="emit('onCancel')"></ui-button>
    <h2 class="centerText">Join a private game</h2>
    <p>Enter the code of a private game to join</p>
    <form class="flex">
        <ui-textfield helper-text-id="privateHelper" v-model="privateGameId" required>Private game code</ui-textfield>
        <ui-textfield-helper id="privateHelper" visible class="rowSpace">xxx-xxxx-xxx</ui-textfield-helper>
        <ui-button raised @click="joinPrivate" :disabled="privateJoinInProgress">Join a private game</ui-button>
    </form>
</template>

<style scoped>
.flex {
    display: inline-grid;
}
.rowSpace {
    margin-bottom: 5px;
}
.centerText {
    justify-content: center;
    display: flex;
}
.backButton {
    width: min-content;
    position: absolute;
}
</style>
