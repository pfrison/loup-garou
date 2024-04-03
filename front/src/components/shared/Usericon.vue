<script setup lang="ts">
import type { AccountInfos } from '@/scripts/accounts';

defineProps<{
    accountInfos: AccountInfos | undefined,
    image: string | undefined,
    size: string
}>();
</script>

<template>
    <img v-if="image" class="profilePic" :src="image"/>
    <div v-else class="textPic">{{ accountInfos?.username.substring(0, 1).toUpperCase() }}</div>
</template>

<style scoped>
.profilePic {
    vertical-align: middle;
    height: v-bind(size);
}
.textPic {
    vertical-align: middle;
    background-color: v-bind('accountInfos?.iconColorBg');
    color: v-bind('accountInfos?.iconColorFg');
    display: inline-grid;
    border-radius: 50%;
    height: v-bind(size);
    width: v-bind(size);
    font-size: v-bind(size);
    overflow: hidden;
    font-weight: bold;
    text-align: center;
    align-content: center;
}
</style>
