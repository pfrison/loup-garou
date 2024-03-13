<script setup lang="ts">

const props = defineProps({
    sessionId: String
});

</script>

<template>
    <h1>Logged in ! sessionId : {{ sessionId }}</h1>
</template>

<style scoped>

</style>
