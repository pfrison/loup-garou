<script setup lang="ts">
import WaitingCircle from '@/components/shared/WaitingCircle.vue';
import { callApi } from '@/scripts/api';
import { Injects } from '@/scripts/consts';
import { format, type Log, LogType, buildNewLog } from '@/scripts/gameLogs';
import { type Game, PlayerRoleText, type Player, PlayerRole } from '@/scripts/games';
import { inject, ref, watch, type Ref } from 'vue';

const props = defineProps<{
    gameInfo: Game | undefined,
    playerRoles: Player[]
}>();

const username: Ref<string> | undefined = inject(Injects.USERNAME);
const logs: Ref<Log[]> = ref([]);

watch(props, buildLogs);

function buildLogs() {
    // Reset
    logs.value = [];
    // Game start log
    if ( props.gameInfo )
        logs.value.push(buildNewLog(LogType.GAME_START));
    // Roles at start
    if ( props.playerRoles && username ) {
        // Self
        const playerRole: PlayerRole = props.playerRoles.find(player => player.name === username.value)?.role as PlayerRole;
        logs.value.push(buildNewLog(LogType.SELF_ROLE_REVEAL, [ PlayerRoleText.get(playerRole) ]));
        // Other werewolves
        if ( playerRole === PlayerRole.WEREWOLF ) {
            props.playerRoles.filter(player => player.name !== username.value && player.role === PlayerRole.WEREWOLF)
                    .forEach(player => logs.value.push(buildNewLog(LogType.WEREWOLF_ROLE_REVEAL, [ player.name ])));
        }
    }
}
</script>

<template>
    <div>
        <WaitingCircle v-if="!gameInfo || playerRoles.length <= 0" :message="'Fetching game informations...'" />
        <div v-else class="logMessages">
            <span v-for="log in logs">{{ format(log) }}</span>
        </div>
    </div>
</template>

<style scoped>
.logMessages {
    display: grid;
}
</style>
