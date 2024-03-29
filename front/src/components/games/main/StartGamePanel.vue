<script setup lang="ts">
import WaitingCircle from '@/components/shared/WaitingCircle.vue';
import { callApi } from '@/scripts/api';
import { Injects } from '@/scripts/consts';
import type { Game } from '@/scripts/games';
import { inject, ref, type Ref } from 'vue';

const props = defineProps<{
    gameInfo: Game | undefined
}>();

const emit = defineEmits(["onAuthError", "onLeave"]);

const username: Ref<string> | undefined = inject(Injects.USERNAME);

const hasActionInProgress = ref(false);

function leave(): void {
    if ( !props.gameInfo )
        return;
    callApi("GET", "/leaveGame", {
        gameId: props.gameInfo.id
    }, () => {
        emit("onLeave");
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
        else
            alert("Unexpected error from the server. Unable to leave the game");
    });
}

function start(): void {
    if ( !props.gameInfo )
        return;
    callApi("GET", "/startGame", {
        gameId: props.gameInfo.id
    }, () => { }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
        else
            alert("Unexpected error from the server. Unable to start the game");
    });
}

function computeStartHoverText(): string | undefined {
    if ( !props.gameInfo || !username )
        return;
    if ( username.value !== props.gameInfo.players[0].name )
        return "Only the game admin (first player in the list) can start the game";
    if ( props.gameInfo.players.length < 3 )
        return "At least 3 players must join before you can start the game";
}
</script>

<template>
    <div class="logPanel centered">
        <WaitingCircle v-if="!gameInfo" :message="'Fetching game informations...'" />
        <div v-else class="grid">
            <h2 class="centerText">Game is ready</h2>
            <p class="centerText rowSpacer">{{ computeStartHoverText() }}</p>
            <p class="centerText rowSpacer">This game is {{ gameInfo.public ? "public. Anyone can join" : ("private. Give this code to your friends : " + gameInfo.id) }}</p>
            <ui-button raised @click="leave" :disabled="hasActionInProgress" class="rowSpacer">Leave the game</ui-button>
            <ui-button raised @click="start" :disabled="computeStartHoverText()">Start the game</ui-button>
        </div>
    </div>
</template>

<style scoped>
.logPanel {
    flex-grow: 1;
    padding: 10px;
}
.centered {
    margin: 0 auto;
    min-height: 85vh; 
    display: flex;
    justify-content: center;
    align-items: center;
}
.grid {
    padding: 50px;
    background-color: #F0F0F0;
    display: grid;
    width: 30%;
}
.centerText {
    text-align: center;
}
p {
    margin: 0;
    font-size: 2vmin;
}
.rowSpacer {
    margin-bottom: 10px;
}
</style>
