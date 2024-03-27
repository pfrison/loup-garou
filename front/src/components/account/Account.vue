<script setup lang="ts">
import { Injects } from '@/scripts/consts';
import { inject } from 'vue';

const username = inject(Injects.USERNAME);
</script>

<template>
    <p>Account page for {{ username }}</p>
</template>

<style scoped>
</style>
