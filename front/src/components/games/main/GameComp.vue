<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { type Game, GameState, type Player } from '@/scripts/games';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import PlayerPanel from './PlayerPanel.vue';
import StartGamePanel from './StartGamePanel.vue';
import GameLogPanel from './GameLogPanel.vue';
import { blobToDataURL, type AccountInfos, type ProfilePicture } from '@/scripts/accounts';

const props = defineProps<{
    gameId: string
}>();

const emit = defineEmits(["onAuthError", "onLeave"]);

const gameInfo: Ref<Game | undefined> = ref(undefined);
const accountInfos: Ref<AccountInfos[]> = ref([]);
const profilePictures: Ref<ProfilePicture[]> = ref([]);
const playerRoles: Ref<Player[]> = ref([]);
const refreshGameInfoIntervalId: Ref<NodeJS.Timeout | undefined> = ref(undefined);

function refreshGameInfo(): void {
    callApi("GET", "/gameInfo", {
        gameId: props.gameId
    }, (json) => {
        gameInfo.value = json;
        watchForGameState();
        // get account info
        const players: string[] | undefined =  gameInfo.value?.players.map(player => player.name)
                // filter already searched account infos
                .filter(player => !accountInfos.value.map(a => a.username).includes(player));
        if ( players && players.length > 0 ) {
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

function getPlayerRoles() {
    callApi("GET", "/playerRoles", {
        gameId: props.gameId
    }, (json) => {
        playerRoles.value = json;
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
    });
}

let previousGameState: GameState | undefined = undefined;
function watchForGameState() {
    if ( previousGameState !== gameInfo.value?.state && gameInfo.value?.state === GameState.IN_PROGRESS ) {
        getPlayerRoles();
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
        <PlayerPanel class="playerPanel" :game-info="gameInfo" :account-infos="accountInfos" :profile-pictures="profilePictures" />
        <StartGamePanel class="logPanel" v-if="gameInfo?.state === GameState.CREATED" :game-info="gameInfo" @on-auth-error="emit('onAuthError')" @on-leave="emit('onLeave')" />
        <GameLogPanel class="logPanel" v-else :game-info="gameInfo" :player-roles="playerRoles" />
    </div>
</template>

<style scoped>
.flex {
    display: flex;
    height: 100%;
    width: 100%;
    position: fixed;
}
.logPanel {
    flex-grow: 1;
    padding: 10px;
}
.playerPanel {
    border-right: solid #F0F0F0 5px;
    width: 10%;
    padding: 10px;
}
</style>
