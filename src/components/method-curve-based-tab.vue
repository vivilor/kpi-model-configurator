<script setup lang="ts">
import { TabPanel } from 'primevue';
import MethodCurveBasedChart from './method-curve-based-chart.vue';

// const App = inject('App')

// const { currentPointKey, pointSelectOptions, reset } = App.Method.Steps

</script>

<template>
  <TabPanel value="Curve">
    <div class="flex flex-col gap-4">

      <MethodCurveBasedChart />

      <!-- <div class="flex">
        <Button @click="reset" label="Сбросить"></Button>
      </div> -->

      <!-- <SelectButton v-model="currentPointKey" :options="pointSelectOptions" option-label="label" option-value="value"
        class="whitespace-nowrap" />

      <MethodStepsBasedPoint /> -->
    </div>
  </TabPanel>
</template>