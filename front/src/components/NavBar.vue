<script setup lang="ts">
import { Injects, NavBarSection } from '@/scripts/consts';
import { inject, type Ref } from 'vue';
import Usericon from './shared/Usericon.vue';
import type { AccountInfos } from '@/scripts/accounts';

console.log("inject navbar " + inject(Injects.USERNAME));
const username = inject(Injects.USERNAME);
defineProps<{
    selected: NavBarSection
}>();
const emit = defineEmits(["onNavClick"]);

const profilePicture: Ref<string> | undefined = inject(Injects.PROFILE_PICTURE);
const accountInfos: Ref<AccountInfos> | undefined = inject(Injects.ACCOUNT_INFOS);

const onAccount = () => emitWith(NavBarSection.ACCOUNT);
const onGames = () => emitWith(NavBarSection.GAMES);
const onScores = () => emitWith(NavBarSection.SCORES);

function emitWith(section: NavBarSection): void {
    emit("onNavClick", section);
}

</script>

<template>
    <div class="navbar">
        <span class="navbarItem navbarTitle">Loup-garou</span>
        <Usericon :size="'5vmin'" :account-infos="accountInfos" :image="profilePicture" />
        <span class="navbarItem navbarText">{{ username }}</span>
        <ui-button :raised="selected === NavBarSection.ACCOUNT" class="navbarItem navbarButton" @click="onAccount">My account</ui-button>
        <ui-button :raised="selected === NavBarSection.GAMES" class="navbarItem navbarButton" @click="onGames">Games</ui-button>
        <ui-button :raised="selected === NavBarSection.SCORES" class="navbarItem navbarButton" @click="onScores">Scores</ui-button>
    </div>
</template>

<style scoped>
.navbar {
    vertical-align: center;
    background-color: #F0F0F0;
    display: flex;
    padding: 2vmin;
    position: sticky;
    top: 0;
    z-index: 999;
}
.navbarItem {
    margin-right: 1vmin;
    margin-top: auto;
    margin-bottom: auto;
    padding: 1vmin;
}
.navbarTitle {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 3vmin;
}
.navbarText {
    font-size: 2vmin;
}
.navbarButton {
    font-size: 2vmin;
}
.navbarIcon {
    vertical-align: middle;
    height: 5vmin;
}
</style>
