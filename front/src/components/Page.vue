<script setup lang="ts">
import { callApi } from "@/scripts/api";
import NavBar from "./NavBar.vue";
import AccountSection from "./account/Account.vue";
import GamesSection from "./games/Games.vue";
import ScoresSection from "./scores/Scores.vue";
import { Injects, NavBarSection } from '@/scripts/consts';
import { inject, onMounted, provide, ref, type Ref } from 'vue';
import type { AccountInfos } from "@/scripts/accounts";

const emit = defineEmits(["onAuthError", "onDisconnect"]);

const selectedSection = ref(NavBarSection.GAMES);
const profilePicture: Ref<string | undefined> = ref(undefined);
const accountInfos: Ref<AccountInfos | undefined> = ref(undefined);

const onNavClick = (section: NavBarSection) => selectedSection.value = section;
const onAuthError = () => emit("onAuthError");
const onDisconnect = () => emit("onDisconnect");

provide(Injects.PROFILE_PICTURE, profilePicture);
provide(Injects.ACCOUNT_INFOS, accountInfos);

onMounted(() => {
    callApi("GET", "/profilePicture", undefined, (blob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => profilePicture.value = reader.result as string
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
    });
    callApi("GET", "/accountInfos", undefined, (json) => {
        accountInfos.value = json;
    }, (errorCode) => {
        if ( errorCode === 403 )
            emit("onAuthError");
    });
});
</script>

<template>
    <NavBar :selected="selectedSection" @on-nav-click="onNavClick" />
    <AccountSection v-if="selectedSection === NavBarSection.ACCOUNT" @on-disconnect="onDisconnect" @on-auth-error="onAuthError" />
    <GamesSection v-if="selectedSection === NavBarSection.GAMES" @on-auth-error="onAuthError" />
    <ScoresSection v-if="selectedSection === NavBarSection.SCORES" />
</template>

<style scoped>
</style>
