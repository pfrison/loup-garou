<script setup lang="ts">
import NavBar from "./NavBar.vue";
import AccountSection from "./account/Account.vue";
import GamesSection from "./games/Games.vue";
import ScoresSection from "./scores/Scores.vue";
import { Injects, NavBarSection } from '@/scripts/consts';
import { inject, ref } from 'vue';

const emit = defineEmits(["onAuthError", "onDisconnect"]);

const selectedSection = ref(NavBarSection.GAMES);

const onNavClick = (section: NavBarSection) => selectedSection.value = section;
const onAuthError = () => emit("onAuthError");
const onDisconnect = () => emit("onDisconnect");

</script>

<template>
    <NavBar :selected="selectedSection" @on-nav-click="onNavClick" />
    <AccountSection v-if="selectedSection === NavBarSection.ACCOUNT" @on-disconnect="onDisconnect" />
    <GamesSection v-if="selectedSection === NavBarSection.GAMES" @on-auth-error="onAuthError" />
    <ScoresSection v-if="selectedSection === NavBarSection.SCORES" />
</template>

<style scoped>
</style>
