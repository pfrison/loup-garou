<script setup lang="ts">
import GameLobbyMenu from './GameLobbyMenu.vue';
import CreateGame from './CreateGame.vue';
import JoinPublic from './JoinPublic.vue';
import JoinPrivate from './JoinPrivate.vue';
import { ref, type Ref } from 'vue';
import { GameLobbySelection } from '@/scripts/consts';

const emit = defineEmits(["onAuthError", "onJoin"]);

const menuSelection: Ref<GameLobbySelection | undefined> = ref(undefined);

function changeSelection(menuSelection_: GameLobbySelection) {
    console.log(menuSelection_);
    menuSelection.value = menuSelection_;
}

function onJoin(gameId: string) {
    emit("onJoin", gameId);
}
</script>

<template>
    <div>
        <div class="grid">
            <GameLobbyMenu v-if="menuSelection === undefined" @on-selection="changeSelection" />
            <CreateGame v-else-if="menuSelection === GameLobbySelection.CREATE_GAME" @on-auth-error="emit('onAuthError')" @on-create="onJoin" @on-cancel="menuSelection = undefined" />
            <JoinPublic v-else-if="menuSelection === GameLobbySelection.JOIN_PUBLIC" @on-auth-error="emit('onAuthError')" @on-join="onJoin" @on-cancel="menuSelection = undefined" />
            <JoinPrivate v-else-if="menuSelection === GameLobbySelection.JOIN_PRIVATE" @on-auth-error="emit('onAuthError')" @on-join="onJoin" @on-cancel="menuSelection = undefined" />
        </div>
    </div>
</template>

<style scoped>
.grid {
    padding: 50px;
    background-color: #F0F0F0;
    display: grid;
    width: 30%;
}
</style>
