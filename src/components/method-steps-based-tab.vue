<script setup lang="ts">
import { Button, SelectButton, TabPanel } from 'primevue';
import { inject } from 'vue';
import MethodStepsBasedPoint from './method-steps-based-point.vue';
import MethodStepsBasedChart from './method-steps-based-chart.vue';

const App = inject('App')

const { currentPointKey, pointSelectOptions, reset } = App.Method.Steps

</script>

<template>
  <TabPanel value="Steps">
    <div class="flex flex-col gap-4">

      <MethodStepsBasedChart />

      <div class="flex">
        <Button @click="reset" label="Сбросить"></Button>
      </div>

      <SelectButton v-model="currentPointKey" :options="pointSelectOptions" option-label="label" option-value="value"
        class="whitespace-nowrap" />

      <MethodStepsBasedPoint />
    </div>
  </TabPanel>
</template>