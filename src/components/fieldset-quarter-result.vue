<script setup lang="ts">
import { Button, Fieldset, Slider, Message } from 'primevue';
import { inject } from 'vue';

const App = inject('App')

const props = defineProps<{
  quarter: keyof typeof App.QuarterResult
}>()

const QuarterResult = App.QuarterResult[props.quarter]
const { pos, min, max, step } = QuarterResult.result

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
        <div>
          <Slider v-model="pos" :min="min" :max="max" :step="step" class="h-56" orientation="vertical" />
        </div>
        <Button severity="secondary" size="small">
          <i class="pi pi-cog"></i>
          Настроить
        </Button>
      </div>
    </template>
  </Fieldset>
</template>