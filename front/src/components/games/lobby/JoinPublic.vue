<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { type Game } from '@/scripts/games';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import PublicGameList from './PublicGameList.vue';

const emit = defineEmits(["onAuthError", "onJoin"]);

const publicJoinInProgress = ref(false);
const publicGames: Ref<Game[]> = ref([]);
const publicGamesRefreshIntervalId: Ref<NodeJS.Timeout | undefined> = ref(undefined);

function joinPublic(gameId: string): void {
    if ( publicJoinInProgress.value === true )
        return;
    publicJoinInProgress.value = true;
    callApi("GET", "/joinGame", {
        gameId: gameId
    }, () => {
        emit("onJoin", gameId);
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
        else if ( errorCode === 404 )
            alert("This game doesn't exist");
        else
            alert("Unexpected error from server, unable to join the game");
    }, () => {
        publicJoinInProgress.value = false
    });
}

function refreshPublicGames() {
    callApi("GET", "/listPublicGames", undefined, (json) => {
        publicGames.value = [];
        json.forEach((game: Game) => {
            publicGames.value.push(game);
        });
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
    });
}

onMounted(() => {
    publicGamesRefreshIntervalId.value = setInterval(refreshPublicGames, 1000);
    refreshPublicGames();
});

onUnmounted(() => {
    if ( publicGamesRefreshIntervalId.value )
        clearInterval(publicGamesRefreshIntervalId.value);
});
</script>

<template>
    <div class="grid">
        <h2 class="centerText">Join a public game</h2>
        <p>Select to join a public game created by other players</p>
        <form class="flex">
            <p v-if="publicGames.length <= 0">No public game found...</p>
            <PublicGameList :games="publicGames" @on-item-click="joinPublic" />
        </form>
    </div>
</template>

<style scoped>
.grid {
    padding: 50px;
    background-color: #F0F0F0;
    display: grid;
    width: 30%;
}
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
</style>
