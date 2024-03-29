<script setup lang="ts">
import type { Game } from '@/scripts/games';

const props = defineProps<{
    games: Game[]
}>();

const emit = defineEmits(["onItemClick"]);
</script>

<template>
    <div class="listParent">
        <ul v-for="game in games" @click="emit('onItemClick', game.id)">
            <span>Game by {{ game.players[0] }} ({{ game.players.length }}/{{ game.maxPlayers }} players)</span>
        </ul>
    </div>
</template>

<style scoped>
ul {
    list-style-type: none;
    margin: 0px;
    padding: 20px;
    cursor: pointer;
}
ul:nth-child(odd) {
    background-color: #E0E0E0;
}
ul:hover {
    background-color: #D0D0D0;
}
.listParent {
    height: 50vmin;
    overflow-y: scroll;
}
</style>
