<script setup lang="ts">
import { type Auth } from '@/scripts/api';
import { NavBarSection } from '@/scripts/consts';

const props = defineProps<{
    auth: Auth,
    selected: NavBarSection
}>();

const emit = defineEmits(["onNavClick"]);

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
        <span class="navbarItem navbarText">{{ auth.username }}</span>
        <ui-button :raised="selected === NavBarSection.ACCOUNT" class="navbarItem navbarButton" @click="onAccount">My account</ui-button>
        <ui-button :raised="selected === NavBarSection.GAMES" class="navbarItem navbarButton" @click="onGames">Games</ui-button>
        <ui-button :raised="selected === NavBarSection.SCORES" class="navbarItem navbarButton" @click="onScores">Scores</ui-button>
    </div>
</template>

<style scoped>
.navbar {
    vertical-align: center;
    width: 100%;
    background-color: #F0F0F0;
    display: flex;
    padding: 2vmin;
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
</style>
