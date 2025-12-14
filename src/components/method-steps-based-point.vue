<script setup lang="ts">
import { Fieldset, Message, Slider } from 'primevue';
import { inject } from 'vue';

const App = inject('App')

const { currentPoint } = App.Method.Steps

</script>

<template>
  <Fieldset>
    <template #legend>
      <div class="flex gap-2 items-center">
        <b>{{ currentPoint.label }}</b>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col gap-2 items-stretch">
        <Message variant="simple" class="min-w-15 flex">
          <div class="flex justify-center items-center flex-nowrap gap-1">
            Выполнение: <span class="minw-10 w-10">{{ currentPoint.X.pos.value }}</span>
          </div>
        </Message>

        <div class="flex gap-4 items-center min-w-10">
          <div class="min-w-10 flex justify-center rounded border border-solid border-gray-600">
            {{ currentPoint.X.min.value }}
          </div>
          <Slider class="w-full" v-model="currentPoint.X.pos.value" :step="currentPoint.X.step.value"
            :min="currentPoint.X.min.value" :max="currentPoint.X.max.value" />
          <div class="min-w-10 flex justify-center rounded border border-solid border-gray-600">
            {{ currentPoint.X.max.value }}
          </div>
        </div>

        <Message variant="simple" class="min-w-15 flex">
          <div class="flex justify-center items-center flex-nowrap gap-1">
            Премия:

            <span class="minw-10 w-10">
              {{ currentPoint.Y.pos.value }}
            </span>
          </div>
        </Message>
        <div class="flex gap-4 items-center min-w-10">
          <div class="min-w-10 flex justify-center rounded border border-solid border-gray-600">
            {{ currentPoint.Y.min.value }}
          </div>
          <Slider class="w-full" v-model="currentPoint.Y.pos.value" :step="currentPoint.Y.step.value"
            :min="currentPoint.Y.min.value" :max="currentPoint.Y.max.value" />
          <div class="min-w-10 flex justify-center rounded border border-solid border-gray-600">
            {{ currentPoint.Y.max.value }}
          </div>
        </div>
      </div>
    </template>
  </Fieldset>
</template>