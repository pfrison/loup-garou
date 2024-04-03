<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { type Game } from '@/scripts/games';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import PublicGameList from './PublicGameList.vue';
import type { AccountInfos } from '@/scripts/accounts';

const emit = defineEmits(["onAuthError", "onJoin"]);

const joinInProgress = ref(false);
const games: Ref<Game[]> = ref([]);
const accountInfos: Ref<AccountInfos[]> = ref([]);
const gamesRefreshIntervalId: Ref<NodeJS.Timeout | undefined> = ref(undefined);

function joinPublic(gameId: string): void {
    if ( joinInProgress.value === true )
        return;
    joinInProgress.value = true;
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
        joinInProgress.value = false
    });
}

function refreshPublicGames() {
    callApi("GET", "/listPublicGames", undefined, (json) => {
        games.value = json as Game[];
        const players: string[] =  games.value.map(game => game.players[0].name)
                // filter already searched account infos
                .filter(player => !accountInfos.value.map(a => a.username).includes(player));
        if ( players.length > 0 ) {
            callApi("GET", "/accountsInfos", {
                users: players
            }, (json) => {
                accountInfos.value = json as AccountInfos[];
            }, (errorCode) => {
                if ( errorCode === 403 )
                    emit("onAuthError");
            });
        }
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
    });
}

onMounted(() => {
    gamesRefreshIntervalId.value = setInterval(refreshPublicGames, 1000);
    refreshPublicGames();
});

onUnmounted(() => {
    if ( gamesRefreshIntervalId.value )
        clearInterval(gamesRefreshIntervalId.value);
});
</script>

<template>
    <div class="grid">
        <h2 class="centerText">Join a public game</h2>
        <p>Select to join a public game created by other players</p>
        <form class="flex">
            <p v-if="games.length <= 0">No public game found...</p>
            <PublicGameList :games="games" :account-infos="accountInfos" @on-item-click="joinPublic" />
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
