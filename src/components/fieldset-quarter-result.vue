<script setup lang="ts">
import { Button, Fieldset, Message, Slider } from 'primevue';
import { inject } from 'vue';
import DialogProbabilitySetup from './dialog-probability-setup.vue';

const App = inject('App')

const props = defineProps<{
  quarter: keyof typeof App.QuarterResult
}>()

const QuarterResult = App.QuarterResult[props.quarter]
const { pos, min, max, step } = QuarterResult.result
const { prob } = QuarterResult

const formatter = new Intl.NumberFormat("ru-RU", { style: "decimal", maximumFractionDigits: 2 })

</script>

<template>
  <Fieldset class="flex-auto">
    <template #legend>{{ QuarterResult.title }}</template>
    <template #default>
      <div class="flex flex-col items-stretch gap-4">
        <Message>
          {{ formatter.format(pos) }}
        </Message>
        <div class="flex items-center gap-4">
          <Slider v-model="pos" :min="min" :max="max" :step="step" class="h-56" orientation="vertical" />

          <div class="flex-auto font-mono text-4xl flex justify-center">
            {{ formatter.format(prob * 100) }}%
          </div>
        </div>
        <Button severity="secondary" size="small" @click="QuarterResult.visible.value = true">
          <i class="pi pi-cog"></i>
          Настроить
        </Button>
      </div>
      <DialogProbabilitySetup :quarter="quarter" />
    </template>
  </Fieldset>
</template>