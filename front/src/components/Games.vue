<script setup lang="ts">
import { callApi, type Auth } from '@/scripts/api';
import { onMounted, ref } from 'vue';
import GameLobby from './GameLobby.vue';
import GameComp from './GameComp.vue';

const props = defineProps<{
    auth: Auth
}>();

const emit = defineEmits(["onAuthError"]);

const gameId = ref("");

const onAuthError = () => emit("onAuthError");
const onJoin = (gameId_: string) => gameId.value = gameId_;
const onLeave = () => gameId.value = "";

onMounted(() => {
    callApi("GET", "/playerGames", undefined, (json) => {
        if ( json?.length )
            gameId.value = json[0];
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
    }, () => {}, props.auth);
});
</script>

<template>
    <div>
        <GameLobby v-if="!gameId" :auth="auth" @on-join="onJoin" @on-auth-error="onAuthError"/>
        <GameComp v-if="gameId" :auth="auth" :game-id="gameId" @on-auth-error="onAuthError" @on-leave="onLeave"/>
    </div>
</template>

<style scoped>
</style>
