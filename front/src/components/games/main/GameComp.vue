<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { PlayerRole, type Game, GameState } from '@/scripts/games';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import PlayerPanel from './PlayerPanel.vue';
import StartGamePanel from './StartGamePanel.vue';
import GameLogPanel from './GameLogPanel.vue';

const props = defineProps<{
    gameId: string
}>();

const emit = defineEmits(["onAuthError", "onLeave"]);

const gameInfo: Ref<Game | undefined> = ref(undefined);
const playerRole: Ref<PlayerRole | undefined> = ref(undefined);
const refreshGameInfoIntervalId: Ref<NodeJS.Timeout | undefined> = ref(undefined);

function refreshGameInfo(): void {
    callApi("GET", "/gameInfo", {
        gameId: props.gameId
    }, (json) => {
        gameInfo.value = json;
        watchForGameState();
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
    });
}

function getPlayerRole() {
    callApi("GET", "/playerRole", {
        gameId: props.gameId
    }, (json) => {
        playerRole.value = json.role;
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
    });
}

let previousGameState: GameState | undefined = undefined;
function watchForGameState() {
    if ( previousGameState !== gameInfo.value?.state && gameInfo.value?.state === GameState.IN_PROGRESS ) {
        getPlayerRole();
    }
    previousGameState = gameInfo.value?.state;
}

onMounted(() => {
    refreshGameInfoIntervalId.value = setInterval(refreshGameInfo, 1000);
    refreshGameInfo();
});

onUnmounted(() => {
    if ( refreshGameInfoIntervalId.value )
        clearInterval(refreshGameInfoIntervalId.value);
});
</script>

<template>
    <div class="flex">
        <PlayerPanel :game-info="gameInfo" />
        <StartGamePanel v-if="gameInfo?.state === GameState.CREATED" :game-info="gameInfo" @on-auth-error="emit('onAuthError')" @on-leave="emit('onLeave')" />
        <GameLogPanel v-else :game-info="gameInfo" :player-role="playerRole" />
    </div>
</template>

<style scoped>
.flex {
    display: flex;
    height: 100%;
    width: 100%;
    position: fixed;
}
</style>
