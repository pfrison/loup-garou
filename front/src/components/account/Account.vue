<script setup lang="ts">
import { callApi } from '@/scripts/api';
import { Injects } from '@/scripts/consts';
import { inject } from 'vue';

const emit = defineEmits(["onDisconnect"]);

const username = inject(Injects.USERNAME);

function disconnect(): void {
    callApi("GET", "/disconnect", undefined, () => {
        emit("onDisconnect");
    }, () => {});
}
</script>

<template>
    <div class="padding grid">
        <p>Account page for {{ username }}</p>
        <ui-button raised @click="disconnect">Disconnect</ui-button>
    </div>
</template>

<style scoped>
.padding {
    padding: 8px;
}
.grid {
    display: grid;
}
</style>
