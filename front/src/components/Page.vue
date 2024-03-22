<script setup lang="ts">
import { type Auth } from '@/scripts/api';
import NavBar from "./NavBar.vue";
import AccountSection from "./Account.vue";
import GamesSection from "./Games.vue";
import ScoresSection from "./Scores.vue";
import { NavBarSection } from '@/scripts/consts';
import { ref } from 'vue';

const props = defineProps<{
    auth: Auth
}>();

const emit = defineEmits(["onAuthError"]);

const selectedSection = ref(NavBarSection.GAMES);

const onNavClick = (section: NavBarSection) => selectedSection.value = section;
const onAuthError = () => emit("onAuthError");

</script>

<template>
    <NavBar :auth="auth" :selected="selectedSection" @on-nav-click="onNavClick" />
    <AccountSection v-if="selectedSection === NavBarSection.ACCOUNT" class="section" :auth="auth" />
    <GamesSection v-if="selectedSection === NavBarSection.GAMES" class="section" :auth="auth" @on-auth-error="onAuthError" />
    <ScoresSection v-if="selectedSection === NavBarSection.SCORES" class="section"/>
</template>

<style scoped>
.section {
    padding: 8px;
}
</style>./GamesLobby.vue
