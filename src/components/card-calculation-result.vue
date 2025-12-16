<script setup lang="ts">
import { Card } from 'primevue';
import Chart from "primevue/chart";
import { computed, inject } from "vue";
import KitCheckbox from './kit-checkbox.vue';

const App = inject('App')

const { Method } = App
const { data, options } = App.Chart.Result
const { I, II, III, IV } = App.QuarterResult

const inRub = new Intl.NumberFormat("ru-RU", { style: "currency", maximumFractionDigits: 0, currency: "RUB" })

const resultByYear = computed(() => [
  I.result.pos.value,
  II.result.pos.value,
  III.result.pos.value,
  IV.result.pos.value,
].reduce((acc, v) => v + acc, 0) / 4 * 100)
</script>

<template>
  <Card>
    <template #title>
      <div class="flex justify-between gap-4">
        Результат вычислений
      </div>
    </template>

    <template #content>
      <div class="flex flex-col gap-4 items-stretch">
        <div class="flex items-center justify-end gap-4">
          <KitCheckbox v-model="Method.Steps.visible.value" bold binary disabled>
            <b>Пошаговый</b>
          </KitCheckbox>
          <KitCheckbox v-model="Method.Linear.visible.value" binary>
            <span class="text-gray-400">Линейный</span>
          </KitCheckbox>
          <KitCheckbox v-model="Method.Curve.visible.value" binary>
            Плавный
          </KitCheckbox>
          <!-- <KitCheckbox v-model="Method.Accum.visible.value" binary>
            Корелляция
          </KitCheckbox> -->
        </div>

        <Chart type="bar" class="h-96" :data="data" :options="options" />

        <div class="flex justify-between mt-4 gap-2 items-start">
          <div class="flex flex-col gap-2 items-start">
            <div class="flex gap-2 items-end">
              <b class="text-4xl text-[#f97415]">
                {{ inRub.format(App.resultBonusesByYearMethodStepsSum.value) }}
                <span class="text-emerald-800!">
                  ({{
                    (App.resultBonusesByYearMethodStepsSum.value / App.CaseParameters.bonusByYearFull.value *
                      100).toFixed(2)
                  }}%)
                </span>
              </b>
              <div>Пошаговым</div>
            </div>
            <div class="flex gap-2 items-end">
              <b class="text-4xl text-[#aaaaaa]">
                {{ inRub.format(App.resultBonusesByYearMethodLinearSum.value) }}
                <span class="text-emerald-800!">
                  ({{
                    (App.resultBonusesByYearMethodLinearSum.value / App.CaseParameters.bonusByYearFull.value *
                      100).toFixed(2)
                  }}%)
                </span>
              </b>
              <div>Линейным</div>
            </div>
            <div class="flex gap-2 items-end" v-if="App.Method.Curve.visible.value">
              <b class="text-4xl text-[#52c80e]">
                {{ inRub.format(App.resultBonusesByYearMethodCurveSum.value) }}
                <span class="text-emerald-800!">
                  ({{
                    (App.resultBonusesByYearMethodCurveSum.value / App.CaseParameters.bonusByYearFull.value *
                      100).toFixed(2)
                  }}%)
                </span>
              </b>
              <div>Плавным</div>
            </div>
            <!-- <div class="flex gap-2 items-end" v-if="App.Method.Accum.visible.value">
              <b class="text-4xl text-[#a307ab]">
                {{ inRub.format(App.resultBonusesByYearMethodAccumSum.value) }}
              </b>
              <div>Корелляцией</div>
            </div> -->
          </div>
          <div class="flex flex-col gap-2 items-stretch">
            <div class="flex gap-2 justify-end items-end">
              <div>Шанс сценария</div>
              <div class="text-4xl">
                {{ App.resultProbability.value }}%
              </div>
            </div>
            <div class="flex gap-2 justify-end items-end">
              <div>Годовой показатель</div>
              <div class="text-4xl">
                {{ resultByYear.toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>
  </Card>
</template>