<script setup lang="ts">
import NavBar from "./NavBar.vue";
import AccountSection from "./account/Account.vue";
import GamesSection from "./games/Games.vue";
import ScoresSection from "./scores/Scores.vue";
import { Injects, NavBarSection } from '@/scripts/consts';
import { inject, ref } from 'vue';

const emit = defineEmits(["onAuthError"]);

const selectedSection = ref(NavBarSection.GAMES);

const onNavClick = (section: NavBarSection) => selectedSection.value = section;
const onAuthError = () => emit("onAuthError");

</script>

<template>
    <NavBar :selected="selectedSection" @on-nav-click="onNavClick" />
    <AccountSection v-if="selectedSection === NavBarSection.ACCOUNT" class="section"/>
    <GamesSection v-if="selectedSection === NavBarSection.GAMES" class="section" @on-auth-error="onAuthError" />
    <ScoresSection v-if="selectedSection === NavBarSection.SCORES" class="section"/>
</template>

<style scoped>
.section {
    padding: 8px;
}
</style>
