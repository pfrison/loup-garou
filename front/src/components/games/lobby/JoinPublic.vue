<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { type Game } from '@/scripts/games';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import PublicGameList from './PublicGameList.vue';
import { blobToDataURL, type AccountInfos, type ProfilePicture } from '@/scripts/accounts';

const emit = defineEmits(["onAuthError", "onJoin", "onCancel"]);

const joinInProgress = ref(false);
const games: Ref<Game[]> = ref([]);
const accountInfos: Ref<AccountInfos[]> = ref([]);
const profilePictures: Ref<ProfilePicture[]> = ref([]);
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
            players.forEach(player => {
                callApi("GET", "/profilePicture", {
                    user: player
                }, (blob: Blob) => {
                    blobToDataURL(blob).then(picture => profilePictures.value.push({ username: player, image: picture }));
                }, (errorCode) => {
                    if ( errorCode === 403 )
                        emit("onAuthError");
                });
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
    <ui-button icon="arrow_back" class="backButton" @click="emit('onCancel')"></ui-button>
    <h2 class="centerText">Join a public game</h2>
    <p>Select to join a public game created by other players</p>
    <form class="flex">
        <p v-if="games.length <= 0">No public game found...</p>
        <PublicGameList :games="games" :account-infos="accountInfos" @on-item-click="joinPublic" :profile-pictures="profilePictures" />
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
