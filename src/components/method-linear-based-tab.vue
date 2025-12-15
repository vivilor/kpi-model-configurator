<script setup lang="ts">
import { TabPanel } from 'primevue';
import MethodLinearBasedChart from './method-linear-based-chart.vue';

</script>

<template>
  <TabPanel value="Linear">
    <div class="flex flex-col gap-4">
      <MethodLinearBasedChart />
    </div>
  </TabPanel>
</template>