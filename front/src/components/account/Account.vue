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
    <div class="centered">
        <div class="grid">
            <h1 class="centerText">Your account</h1>
            <p>With you current profile picture, others will see you like this : <UsernameIconPair :accountInfos="accountInfos" :image="profilePicture"/></p>
            <ui-button raised @click="disconnect">Disconnect</ui-button>
        </div>
    </div>
</template>

<style scoped>
.centered {
    margin: 0 auto;
    min-height: 85vh; 
    display: flex;
    justify-content: center;
    align-items: center;
}
.grid {
    padding: 50px;
    background-color: #F0F0F0;
    display: grid;
    width: 30%;
}
h1 {
    text-transform: uppercase;
    margin-top: 0;
    padding-top: 0;
}
.centerText {
    justify-content: center;
    display: flex;
}
</style>
