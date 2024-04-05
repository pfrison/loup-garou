<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { ref } from 'vue';

const emit = defineEmits(["onAuthError", "onCreate", "onCancel"]);

const createNumberPlayers = ref(0);
const createPublicGame = ref(true);
const createGameInProgress = ref(false);

function createGame(): void {
    let errorSanitize = sanitizeCreateNumberPlayers(createNumberPlayers.value);
    if ( errorSanitize ) {
        alert(errorSanitize);
        return;
    }
    createGameInProgress.value = true;
    callApi("POST", "/createGame", {
        isPublic: createPublicGame.value,
        maxPlayers: createNumberPlayers.value
    }, (json) => {
        emit("onCreate", json?.gameId);
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
        else
            alert("Unexpected error from server, unable to create the game");
    }, () => {
        createGameInProgress.value = false;
    });
}

function sanitizeCreateNumberPlayers(players: number): string | undefined {
    if ( players < 3 )
        return "Number of players should be at least 3";
    else if ( players > 8 )
        return "Number of players cannot exceed 8";
    return undefined;
}
</script>

<template>
    <ui-button icon="arrow_back" class="backButton" @click="emit('onCancel')"></ui-button>
    <h2 class="centerText">Create a new game</h2>
    <p>Tweak the parameters and create your own game</p>
    <form class="flex">
        <ui-textfield required input-type="number" v-model="createNumberPlayers" class="rowSpace">Number of players</ui-textfield>
        <ui-form-field>
            <ui-checkbox v-model="createPublicGame" input-id="publicGame"></ui-checkbox>
            <label for="publicGame">Public game (anyone can join)</label>
        </ui-form-field>
        <ui-button raised @click="createGame" :disabled="createGameInProgress">Create a new game</ui-button>
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
