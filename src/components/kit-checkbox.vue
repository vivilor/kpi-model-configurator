<script lang="ts" setup>
import { Checkbox } from 'primevue';
import { v4 } from 'uuid';

defineProps<{
  bold?: boolean
  label?: string
}>()

const uuid = v4()
const modelValue = defineModel()
</script>

<template>
  <div class="flex items-center gap-2">
    <Checkbox v-model="modelValue" v-bind="$attrs" :input-id="uuid" />

    <label :for="uuid" :class="{ 'font-bold': bold }" class="cursor-pointer select-none">
      <slot>
        {{ label }}
      </slot>
    </label>
  </div>
</template>