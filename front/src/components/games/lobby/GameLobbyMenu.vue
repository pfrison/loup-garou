<script setup lang="ts">
import { GameLobbySelection } from '@/scripts/consts';

const emit = defineEmits(["onSelection"]);
</script>

<template>
    <h1 class="centerText">Game's on !</h1>
    <ui-button class="button" raised @click="emit('onSelection', GameLobbySelection.CREATE_GAME)">Create a new game</ui-button>
    <ui-button class="button" raised @click="emit('onSelection', GameLobbySelection.JOIN_PUBLIC)">Join a public game</ui-button>
    <ui-button class="button" raised @click="emit('onSelection', GameLobbySelection.JOIN_PRIVATE)">Join a private game</ui-button>
</template>

<style scoped>
h1 {
    text-transform: uppercase;
    margin-top: 0;
    padding-top: 0;
}
.centerText {
    justify-content: center;
    display: flex;
}
.button {
    margin-bottom: 10px;
}
</style>
