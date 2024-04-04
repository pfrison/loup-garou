<script setup lang="ts">
import { Injects } from '@/scripts/consts';
import { type Game, GameState } from '@/scripts/games';
import { inject, type Ref } from 'vue';
import UsernameIconPair from '@/components/shared/UsernameIconPair.vue';
import type { AccountInfos, ProfilePicture } from '@/scripts/accounts';

defineProps<{
    gameInfo: Game | undefined,
    accountInfos: AccountInfos[],
    profilePictures: ProfilePicture[]
}>();

const username: Ref<string> | undefined = inject(Injects.USERNAME);
</script>

<template>
    <div>
        <div v-if="gameInfo">
            <h2 v-if="gameInfo.state === GameState.CREATED">Players {{ gameInfo.players.length }}/{{ gameInfo.maxPlayers }}</h2>
            <h2 v-else>Players</h2>
            <ul v-for="player in gameInfo.players">
                <span :class="{ bold: username === player.name }">
                    <UsernameIconPair :accountInfos="accountInfos.find(i => i.username === player.name)"
                        :image="profilePictures.find(i => i.username === player.name)?.image" />
                    {{ username === player.name ? " (you)" : "" }}
                </span>
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
