<script setup lang="ts">
import { Fieldset, TabPanel } from 'primevue';
import MethodLinearBasedChart from './method-linear-based-chart.vue';
import { inject } from 'vue';
import SliderPointValue from './slider-point-value.vue';

const App = inject('App')

const { xBonusDeny } = App.Method.Linear
</script>

<template>
  <TabPanel value="Linear">
    <div class="flex flex-col gap-4">
      <MethodLinearBasedChart />


      <Fieldset>
        <template #legend>
          <b class="text-red-400">Точка лишения премии</b>
        </template>

        <template #default>
          <SliderPointValue v-model="xBonusDeny.pos.value" :min="xBonusDeny.min.value" :max="xBonusDeny.max.value"
            :step="xBonusDeny.step.value" />
        </template>
      </Fieldset>
    </div>
  </TabPanel>
</template>