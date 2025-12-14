<script setup lang="ts">
import { Message } from 'primevue';
</script>

<template>
  <Message variant="simple" severity="contrast" class="font-bold font-mono">
    <slot />
    <!-- <span class="text-xl">
    </span> -->
  </Message>
</template>