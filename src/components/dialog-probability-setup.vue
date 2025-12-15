<script setup lang="ts">
import { inject } from 'vue';
import { Dialog } from 'primevue';
import ProbabilityDistribution from './probability-distribution.vue';

const props = defineProps<{
  quarter: keyof typeof App.QuarterResult
}>()

const App = inject('App')

const { visible } = App.QuarterResult[props.quarter]
</script>

<template>
  <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '70%' }">
    <ProbabilityDistribution :quarter="quarter" />
  </Dialog>
</template>