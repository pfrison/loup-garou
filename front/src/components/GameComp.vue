<script setup lang="ts">
import { callApi, type Auth } from '@/scripts/api';
import type { Game } from '@/scripts/games';
import { onMounted, ref, type Ref } from 'vue';

const props = defineProps<{
    auth: Auth,
    gameId: string
}>();

const emit = defineEmits(["onAuthError", "onLeave"]);

const gameInfo: Ref<Game | undefined> = ref(undefined);
const unexpectedError = ref(false);
const RefreshGameInfoIntervalId = ref(0);
const leaveInProgress = ref(false);

function refreshGameInfo(): void {
    callApi("GET", "/gameInfo", {
        gameId: props.gameId
    }, (json) => {
        unexpectedError.value = false;
        gameInfo.value = json;
    }, (errorCode) => {
        if ( RefreshGameInfoIntervalId.value !== 0 )
            clearInterval(RefreshGameInfoIntervalId.value);
        if ( errorCode === 403 )
            emit("onAuthError");
        else
            unexpectedError.value = true;
    }, () => {}, props.auth);
}

function leave(): void {
    if ( RefreshGameInfoIntervalId.value !== 0 )
        clearInterval(RefreshGameInfoIntervalId.value);
    callApi("GET", "/leaveGame", {
        gameId: props.gameId
    }, () => {
        emit("onLeave");
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
        else
            alert("Unexpected error from the server. Unable to leave the game");
    }, () => {}, props.auth);
}

onMounted(() => {
    RefreshGameInfoIntervalId.value = setInterval(refreshGameInfo, 1000);
    refreshGameInfo();
});
</script>

<template>
    <p v-if="unexpectedError" class="errorInfo">An unexpected error occured</p>
    <span v-if="!gameInfo">Fetching game data...</span>
    <div v-else>
        <p>Game status : {{ gameInfo.state }}</p>
        <p>Game id : {{ gameInfo.id }}</p>
        <p>Players in game ({{ gameInfo.players.length }}/{{ gameInfo.maxPlayers }}) :</p>
        <li v-for="player in gameInfo.players" class="playerList">
            {{ player }}
        </li>
        <ui-button raised @click="leave" :disabled="leaveInProgress">Leave the game</ui-button>
    </div>
</template>

<style scoped>
.errorInfo {
    color: red;
}
.playerList {
    margin-left: 20px;
}
</style>
