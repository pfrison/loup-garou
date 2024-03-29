<script setup lang="ts">
defineProps<{
    message: string
}>();
</script>

<template>
    <div class="centered">
        <div class="grid">
            <ui-spinner active class="marginAuto"></ui-spinner>
            <span>{{ message }}</span>
        </div>
    </div>
</template>

<style scoped>
.centered {
    margin: 0 auto;
    min-height: 85vh; 
    display: flex;
    justify-content: center;
    align-items: center;
}
.grid {
    display: grid;
}
.marginAuto{
    margin: auto;
}
</style>
