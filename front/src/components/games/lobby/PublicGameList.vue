<script setup lang="ts">
import UsernameIconPair from '@/components/shared/UsernameIconPair.vue';
import type { AccountInfos, ProfilePicture } from '@/scripts/accounts';
import type { Game } from '@/scripts/games';

const props = defineProps<{
    games: Game[],
    accountInfos: AccountInfos[],
    profilePictures: ProfilePicture[]
}>();

const emit = defineEmits(["onItemClick", "onAuthError"]);
</script>

<template>
    <div class="listParent">
        <ul v-for="game in games" @click="emit('onItemClick', game.id)">
            <span>Game by <UsernameIconPair
                :accountInfos="accountInfos.find(i => i.username === game.players[0].name)"
                :image="profilePictures.find(i => i.username === game.players[0].name)?.image"/> ({{ game.players.length }}/{{ game.maxPlayers }} players)</span>
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
