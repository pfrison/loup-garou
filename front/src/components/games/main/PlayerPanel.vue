<script setup lang="ts">
import { Injects } from '@/scripts/consts';
import { type Game, GameState } from '@/scripts/games';
import { inject, type Ref } from 'vue';

defineProps<{
    gameInfo: Game | undefined
}>();

const username: Ref<string> | undefined = inject(Injects.USERNAME);
</script>

<template>
    <div>
        <div v-if="gameInfo">
            <h2 v-if="gameInfo.state === GameState.CREATED">Players {{ gameInfo.players.length }}/{{ gameInfo.maxPlayers }}</h2>
            <h2 v-else>Players</h2>
            <ul v-for="player in gameInfo.players">
                <span :class="{ bold: username === player.name }">{{ player.name }}{{ username === player.name ? " (you)" : "" }}</span>
            </ul>
        </div>
    </div>
</template>

<style scoped>
ul {
    padding-left: 5px;
}
.bold {
    font-weight: bold;
}
</style>
