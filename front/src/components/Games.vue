<script setup lang="ts">
import { type Auth } from '@/scripts/api';

const props = defineProps<{
    auth: Auth
}>();

</script>

<template>
    <p>Games selection page for {{ auth.username }}</p>
</template>

<style scoped>
</style>
