<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { gameIdPattern, type Game } from '@/scripts/games';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';

const emit = defineEmits(["onAuthError", "onJoin"]);

const createNumberPlayers = ref(0);
const createPublicGame = ref(true);
const createGameInProgress = ref(false);

const publicJoinInProgress = ref(false);
const publicGames: Ref<Game[]> = ref([]);
const publicGamesRefreshIntervalId: Ref<NodeJS.Timeout | undefined> = ref(undefined);

const privateGameId = ref("");
const privateJoinInProgress = ref(false);

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
        emit("onJoin", json?.gameId);
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

function joinPublic(gameId: string): void {
    if ( publicJoinInProgress.value === true )
        return;
    publicJoinInProgress.value = true;
    joinGame(gameId, () => publicJoinInProgress.value = false);
}

function joinPrivate(): void {
    let errorSanitize = sanitizeGameId(privateGameId.value);
    if ( errorSanitize ) {
        alert(errorSanitize);
        return;
    }
    privateJoinInProgress.value = true;
    joinGame(privateGameId.value, () => privateJoinInProgress.value = false);
}

function sanitizeGameId(gameId: string): string | undefined {
    if ( !gameId )
        return "Game id is required";
    else if ( !gameIdPattern.test(gameId) )
        return "Game id must be in a form of xxx-xxxx-xxx";
    return undefined;
}

function joinGame(gameId: string, callback: () => void) {
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
        callback();
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
})
</script>

<template>
    <h1>Games tab</h1>
    <p>Here you can create a new game or join an existing public one</p>
    <hr>
    <h2>Create a game</h2>
    <p>Create a new game</p>
    <form class="flex">
        <ui-textfield required input-type="number" v-model="createNumberPlayers" class="rowSpace">Number of players</ui-textfield>
        <ui-form-field>
            <ui-checkbox v-model="createPublicGame" input-id="publicGame"></ui-checkbox>
            <label for="publicGame">Public game (anyone can join)</label>
        </ui-form-field>
        <ui-button raised @click="createGame" :disabled="createGameInProgress">Create a new game</ui-button>
    </form>
    <hr>
    <h2>Join a public game</h2>
    <p>Select to join a public game created by other players</p>
    <form class="flex">
        <p v-if="publicGames.length <= 0">No public game found</p>
        <li v-else v-for="game in publicGames">
            <span @click="joinPublic(game.id)">Game by {{ game.players[0] }} ({{ game.players.length }}/{{ game.maxPlayers }} players)</span>
        </li>
    </form>
    <hr>
    <h2>Join a private game</h2>
    <p>Enter the code of a private game to join</p>
    <form class="flex">
        <ui-textfield helper-text-id="privateHelper" v-model="privateGameId" required>Private game code</ui-textfield>
        <ui-textfield-helper id="privateHelper" visible class="rowSpace">xxx-xxxx-xxx</ui-textfield-helper>
        <ui-button raised @click="joinPrivate" :disabled="privateJoinInProgress">Join a private game</ui-button>
    </form>
</template>

<style scoped>
hr {
    margin: 10px;
    color: #E0E0E0;
}
h1 {
    text-transform: uppercase;
}
.flex {
    margin-left: 20px;
    display: inline-grid;
}
.rowSpace {
    margin-bottom: 5px;
}
</style>
