<script setup lang="ts">
import { type Auth } from '@/scripts/api';
import { ref } from 'vue';

const props = defineProps<{
    auth: Auth
}>();

const createNumberPlayers = ref(0);

function createGame() {
    let errorSanitize = sanitizeCreateNumberPlayers(createNumberPlayers.value);
    if ( errorSanitize ) {
        alert(errorSanitize);
    }

}

function sanitizeCreateNumberPlayers(players: number): string | undefined {
    if ( players < 3 ) {
        return "Number of players should be at least 3";
    } else if ( players > 8 ) {
        return "Number of players cannot exceed 8";
    }
    return undefined;
}

</script>

<template>
    <div>
        <h1>Games tab</h1>
        <p>Here you can create a new game or join an existing public one</p>
        <hr>
        <h2>Create a game</h2>
        <p>Create a new game</p>
        <form class="flex">
            <ui-textfield required input-type="number" v-model="createNumberPlayers" class="rowSpace">Number of players</ui-textfield>
            <ui-button raised @click="createGame">Create a new game</ui-button>
        </form>
        <hr>
        <h2>Join a public game</h2>
        <p>Select to join a public game created by other players</p>
        <hr>
        <h2>Join a private game</h2>
        <p>Enter the code of a private game to join</p>
        <ui-textfield helper-text-id="privateHelper">Private game code</ui-textfield>
        <ui-textfield-helper id="privateHelper" visible>xxx-xxxx-xxx</ui-textfield-helper>
    </div>
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
    display: inline-grid;
}
.rowSpace {
    margin-bottom: 5px;
}
</style>
