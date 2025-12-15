<script setup lang="ts">
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Checkbox from 'primevue/checkbox'
import { inject } from 'vue'
import SliderPointValue from './slider-point-value.vue'
// import { useProbabilityDistribution } from '@/composables/use-probability-distribution'

const props = defineProps<{
  quarter: keyof typeof App.QuarterResult
}>()

const App = inject('App')

const { Dist } = App.QuarterResult[props.quarter]

const {
  // Точки
  x1, y1,
  x2, y2,
  x3, y3,

  // Границы
  minX, maxX,
  minY, maxY,

  // Вычисляемые значения
  // getDistributionValue,
  // distributionPoints,
  areaUnderCurve,
  medianX,

  // График
  label,
  visible,
  chartData,
  chartOptions,

  // Методы
  resetToDefaults,
  setUniformDistribution,
  setNormalDistribution,
  setLeftSkewed,
  setRightSkewed
} = Dist

// Переменная для тестирования
// const testX = ref(1.0)
</script>


<template>
  <div class="probability-distribution">
    <div class="flex flex-col gap-4 items-stretch">
      <!-- Заголовок -->
      <div class="flex align-items-center justify-content-between">
        <h3>{{ label }}</h3>
        <div class="flex align-items-center gap-2">
          <Checkbox v-model="visible" inputId="visible" :binary="true" />
          <label for="visible">Показать</label>
        </div>
      </div>

      <div class="flex gap-4">
        <Chart class="flex-7 h-96" type="line" :data="chartData" :options="chartOptions" />

        <div class="flex-4 flex gap-4 items-start">

          <!-- Управление -->
          <div class="col-12 lg:col-4">
            <div class="card">
              <h4>Управление распределением</h4>

              <!-- Быстрые пресеты -->
              <div class="mb-4">
                <h5>Быстрые настройки:</h5>
                <div class="flex flex-wrap gap-2">
                  <Button label="Равномерное" severity="secondary" size="small" @click="setUniformDistribution" />
                  <Button label="Нормальное" severity="secondary" size="small" @click="setNormalDistribution" />
                  <Button label="Слева" severity="secondary" size="small" @click="setLeftSkewed" />
                  <Button label="Справа" severity="secondary" size="small" @click="setRightSkewed" />
                  <Button label="Сброс" severity="danger" size="small" @click="resetToDefaults" />
                </div>
              </div>

              <!-- Начальная точка -->
              <div class="field mb-4">
                <h5>Начальная точка (P1):</h5>

                <SliderPointValue v-model="x1" :min="minX" :max="x2" :step="0.01">
                  X₂
                </SliderPointValue>
                <SliderPointValue v-model="y1" :min="minY" :max="maxY" :step="0.01">
                  Y₂
                </SliderPointValue>
              </div>

              <!-- Контрольная точка -->
              <div class="field mb-4">
                <h5>Контрольная точка (P2):</h5>

                <SliderPointValue v-model="x2" :min="x1" :max="x3" :step="0.01">
                  X₂
                </SliderPointValue>
                <SliderPointValue v-model="y2" :min="minY" :max="maxY" :step="0.01">
                  Y₂
                </SliderPointValue>
              </div>

              <!-- Конечная точка -->
              <div class="field mb-4">
                <h5>Конечная точка (P3):</h5>

                <SliderPointValue v-model="x3" :min="x2" :max="maxX" :step="0.01">
                  X₃
                </SliderPointValue>
                <SliderPointValue v-model="y3" :min="minY" :max="maxY" :step="0.01">
                  Y₃
                </SliderPointValue>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-start gap-6 justify-between">
        <div class="col-12 md:col-4">
          <Card class="text-center">
            <template #title>Площадь</template>
            <template #content>
              <div class="text-2xl font-bold">
                {{ (areaUnderCurve / 2 * 100).toFixed(1) }}%
              </div>
              <small>Нормированная площадь</small>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-4">
          <Card class="text-center">
            <template #title>Медиана</template>
            <template #content>
              <div class="text-2xl font-bold">
                {{ medianX.toFixed(2) }}
              </div>
              <small>Значение X</small>
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-4">
          <Card class="text-center">
            <template #title>Пик</template>
            <template #content>
              <div class="text-2xl font-bold">
                {{ (Math.max(y1, y2, y3) * 100).toFixed(1) }}%
              </div>
              <small>Максимальная вероятность</small>
            </template>
          </Card>
        </div>
      </div>

      <!-- График -->
    </div>
  </div>
</template>
