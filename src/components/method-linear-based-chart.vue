<script setup lang="ts">
import { Fieldset } from 'primevue';
import Chart from 'primevue/chart';
import { inject } from 'vue';

const App = inject('App')

const { chartData, chartOptions } = App.Method.Linear
</script>

<template>
  <Fieldset>
    <template #legend>
      График линейный <span class="font-serif italic">y = x</span>
    </template>
    <template #default>
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </template>
  </Fieldset>
</template>