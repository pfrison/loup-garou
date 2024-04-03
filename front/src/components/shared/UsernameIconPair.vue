<script setup lang="ts">
import type { AccountInfos } from '@/scripts/accounts';
import Usericon from './Usericon.vue';

defineProps<{
    accountInfos: AccountInfos | undefined,
    image: string | undefined
}>();
</script>

<template>
    <Usericon :size="'1em'" :account-infos="accountInfos" :image="image" />
    {{ accountInfos?.username }}
</template>

<style scoped>
</style>
