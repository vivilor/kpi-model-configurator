<script setup lang="ts">
import { TabPanel } from 'primevue';
import MethodCurveBasedChart from './method-curve-based-chart.vue';


</script>

<template>
  <TabPanel value="Curve">
    <div class="flex flex-col gap-4">

      <MethodCurveBasedChart />

      
    </div>
  </TabPanel>
</template>