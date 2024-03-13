<script setup lang="ts">
import { type Auth } from '@/scripts/api';

const props = defineProps<{
    auth: Auth
}>();

</script>

<template>
    <h1>Logged in ! username : {{ auth.username }}, sessionId : {{ auth.sessionId }}</h1>
</template>

<style scoped>

</style>
