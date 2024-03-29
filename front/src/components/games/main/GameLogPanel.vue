<script setup lang="ts">
import WaitingCircle from '@/components/shared/WaitingCircle.vue';
import { callApi } from '@/scripts/api';
import { Injects } from '@/scripts/consts';
import { type Game, type PlayerRole, PlayerRoleText } from '@/scripts/games';
import { inject, ref, type Ref } from 'vue';

const props = defineProps<{
    gameInfo: Game | undefined,
    playerRole: PlayerRole | undefined
}>();

const username: Ref<string> | undefined = inject(Injects.USERNAME);

</script>

<template>
    <div class="logPanel">
        <WaitingCircle v-if="!gameInfo || playerRole === undefined" :message="'Fetching game informations...'" />
        <div v-else class="logMessages">
            <span>Started game with id : {{ gameInfo?.id }}</span>
            <span>Your role is : {{ PlayerRoleText.get(playerRole) }}</span>
        </div>
    </div>
</template>

<style scoped>
.logPanel {
    flex-grow: 1;
    padding: 10px;
}
.logMessages {
    display: grid;
}
</style>
