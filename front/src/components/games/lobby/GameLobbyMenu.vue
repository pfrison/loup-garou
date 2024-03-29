<script setup lang="ts">
import { GameLobbySelection } from '@/scripts/consts';

const emit = defineEmits(["onSelection"]);
</script>

<template>
    <div class="grid">
        <h1 class="centerText">Game's on !</h1>
        <ui-button class="button" raised @click="emit('onSelection', GameLobbySelection.CREATE_GAME)">Create a new game</ui-button>
        <ui-button class="button" raised @click="emit('onSelection', GameLobbySelection.JOIN_PUBLIC)">Join a public game</ui-button>
        <ui-button class="button" raised @click="emit('onSelection', GameLobbySelection.JOIN_PRIVATE)">Join a private game</ui-button>
    </div>
</template>

<style scoped>
h1 {
    text-transform: uppercase;
    margin-top: 0;
    padding-top: 0;
}
.grid {
    padding: 50px;
    background-color: #F0F0F0;
    display: grid;
    width: 30%;
}
.centerText {
    justify-content: center;
    display: flex;
}
.button {
    margin-bottom: 10px;
}
</style>
