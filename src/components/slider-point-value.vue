<script setup lang="ts">
import { Slider } from 'primevue';
import MessageValue from './message-value.vue';

defineProps<{
  min: number,
  max: number,
  step: number
}>()

const modelValue = defineModel<number>({ default: 0 })
</script>

<template>
  <div class="flex gap-2 items-center">
    <MessageValue class="italic font-serif">
      <slot>
        x<sub>p</sub>
      </slot>
    </MessageValue>
    <Slider v-model="modelValue" :min="min" :max="max" :step="step" class="flex-auto" />
    <MessageValue> {{ modelValue.toFixed(2) }} </MessageValue>
  </div>
</template>