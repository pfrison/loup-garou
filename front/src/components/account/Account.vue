<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { Injects } from '@/scripts/consts';
import { inject, type Ref } from 'vue';
import UsernameIconPair from '@/components/shared/UsernameIconPair.vue'
import { type AccountInfos } from '@/scripts/accounts';

const emit = defineEmits(["onDisconnect", "onAuthError"]);

const profilePicture: Ref<string> | undefined = inject(Injects.PROFILE_PICTURE);
const accountInfos: Ref<AccountInfos> | undefined = inject(Injects.ACCOUNT_INFOS);

function disconnect(): void {
    callApi("GET", "/disconnect", undefined, () => {
        emit("onDisconnect");
    }, () => {});
}
</script>

<template>
    <div class="padding grid">
        <p>Account page for <UsernameIconPair :accountInfos="accountInfos" :image="profilePicture"/></p>
        <ui-button raised @click="disconnect">Disconnect</ui-button>
    </div>
</template>

<style scoped>
.padding {
    padding: 8px;
}
.grid {
    display: grid;
}
</style>
