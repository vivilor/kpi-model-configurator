<script setup lang="ts">
import { Checkbox, Fieldset } from 'primevue'
import Chart from 'primevue/chart'
import { inject } from 'vue'
import SliderPointValue from './slider-point-value.vue'

const App = inject('App')

const { chartOptions, chartData, xBonusDeny, A, B, lockAToLine, lockBToLine, P } = App.Method.Curve

// const chartRef = ref()

// Точка связки P
// const xP = ref<number>(1.0)
// const yP = computed(() => xP.value)
// // const lockPToDiagonal = ref<boolean>(true)

// // Точка для первого графика A
// const xA = ref<number>(0.3)
// const yA = ref<number>(0.3)

// // Точка для второго графика B
// const xB = ref<number>(1.7)
// const yB = ref<number>(1.7)


// Параметры кривизны
// const t1 = computed<number>(() => yA.value - xA.value)
// const t2 = computed<number>(() => yB.value - xB.value)

// Обработка изменений точки P
// const handlePChange = () => {

//   // Обновляем ограничения для точек A и B
//   if (xA.value > xP.value) xA.value = xP.value
//   if (yA.value > yP.value) yA.value = yP.value
//   if (xB.value < xP.value) xB.value = xP.value
//   if (yB.value < yP.value) yB.value = yP.value

//   // Если точки привязаны к линиям, пересчитываем их
//   if (lockAToLine.value) {
//     updatePointAOnLine()
//   }
//   if (lockBToLine.value) {
//     updatePointBOnLine()
//   }
// }

// Обработка изменений точки A
// const handleAChange = (changedAxis: 'x' | 'y') => {
//   if (lockAToLine.value) {
//     updatePointAOnLine(changedAxis)
//   }

//   // Проверяем границы
//   xA.value = Math.max(0, Math.min(xA.value, xP.value))
//   yA.value = Math.max(0, Math.min(yA.value, yP.value))
// }

// // Обработка изменений точки B
// const handleBChange = (changedAxis: 'x' | 'y') => {
//   if (lockBToLine.value) {
//     updatePointBOnLine(changedAxis)
//   }

//   // Проверяем границы
//   xB.value = Math.max(xP.value, Math.min(xB.value, 2))
//   yB.value = Math.max(yP.value, Math.min(yB.value, 2))
// }

// Обновление точки A на линии (0, yP) - (xP, 0)
// const updatePointAOnLine = (changedAxis?: 'x' | 'y') => {
//   // Уравнение линии: (x / xP) + (y / yP) = 1
//   if (changedAxis === 'x') {
//     // Вычисляем y по x
//     if (xP.value > 0) {
//       yA.value = yP.value * (1 - xA.value / xP.value)
//     }
//   } else {
//     // Вычисляем x по y
//     if (yP.value > 0) {
//       xA.value = xP.value * (1 - yA.value / yP.value)
//     }
//   }
// }

// Обновление точки B на линии (xP, 2) - (2, yP)
// const updatePointBOnLine = (changedAxis?: 'x' | 'y') => {
//   // Уравнение линии: (x - xP)/(2 - xP) + (y - yP)/(2 - yP) = 1
//   const dx = 2 - xP.value
//   const dy = 2 - yP.value

//   if (changedAxis === 'x') {
//     // Вычисляем y по x
//     if (dx > 0) {
//       yB.value = yP.value + dy * (1 - (xB.value - xP.value) / dx)
//     }
//   } else {
//     // Вычисляем x по y
//     if (dy > 0) {
//       xB.value = xP.value + dx * (1 - (yB.value - yP.value) / dy)
//     }
//   }
// }

// Функция для расчета кривой
// const calculateCurve = (startX: number, endX: number, controlX: number, controlY: number, isFirstCurve: boolean): Array<{ x: number, y: number }> => {
//   const points = []
//   const steps = 100

//   // Нормализуем контрольную точку относительно текущего отрезка
//   let normalizedControlX, normalizedControlY

//   if (isFirstCurve) {
//     // Для первой кривой: от (0,0) до (xP, yP)
//     normalizedControlX = (xA.value - startX) / (endX - startX)
//     normalizedControlY = (yA.value - startX) / (endX - startX) // Для y используем ту же нормализацию
//   } else {
//     // Для второй кривой: от (xP, yP) до (2,2)
//     normalizedControlX = (xB.value - startX) / (endX - startX)
//     normalizedControlY = (yB.value - startX) / (endX - startX)
//   }

//   const t = normalizedControlY - normalizedControlX

//   for (let i = 0; i <= steps; i++) {
//     const progress = i / steps
//     const x = startX + progress * (endX - startX)
//     const normalizedX = progress

//     let normalizedY: number
//     if (t <= 0) {
//       // Правая дуга или промежуточное состояние
//       normalizedY = (1 + t) * normalizedX + (-t) * (1 - Math.sqrt(1 - normalizedX * normalizedX))
//     } else {
//       // Левая дуга или промежуточное состояние
//       normalizedY = (1 - t) * normalizedX + t * Math.sqrt(1 - (normalizedX - 1) * (normalizedX - 1))
//     }

//     // Денормализация
//     const y = startX + normalizedY * (endX - startX)

//     points.push({ x, y })
//   }

//   return points
// }

</script>

<template>
  <div class="flex flex-col items-stretch">

    <Fieldset>
      <template #legend>
        График настройки двойной кривой
      </template>
      <template #default>
        <Chart type="line" :data="chartData" :options="chartOptions" />
      </template>
    </Fieldset>


    <Fieldset>
      <template #legend>
        Точка лишения премии
      </template>

      <template #default>
        <SliderPointValue v-model="xBonusDeny.pos.value" :min="xBonusDeny.min.value" :max="xBonusDeny.max.value"
          :step="xBonusDeny.step.value" />
      </template>
    </Fieldset>

    <Fieldset>
      <template #legend>
        Точка соединения фрагментов
      </template>

      <template #default>
        <SliderPointValue v-model="P.X.pos.value" :min="P.X.min.value" :max="P.X.max.value" :step="P.X.step.value">
          x<sub>p</sub>
        </SliderPointValue>
      </template>
    </Fieldset>

    <Fieldset>
      <template #legend>
        Точка кривизны первого фрагмента
      </template>

      <template #default>
        <div class="flex gap-2 flex-col items-stretch">
          <div class="flex align-items-center">
            <Checkbox v-model="lockAToLine" inputId="lockA" :binary="true" />
            <label for="lockA" class="ml-2">Двигать по линии</label>
          </div>

          <SliderPointValue v-model="A.X.pos.value" :min="A.X.min.value" :max="A.X.max.value" :step="A.X.step.value">
            x<sub>a</sub>
          </SliderPointValue>
          <SliderPointValue v-model="A.Y.pos.value" :min="A.Y.min.value" :max="A.Y.max.value" :step="A.Y.step.value">
            y<sub>a</sub>
          </SliderPointValue>
        </div>

      </template>
    </Fieldset>

    <Fieldset>
      <template #legend>
        Точка кривизны второго фрагмента
      </template>

      <template #default>
        <div class="flex gap-2 flex-col items-stretch">
          <div class="flex align-items-center">
            <Checkbox v-model="lockBToLine" inputId="lockB" :binary="true" />
            <label for="lockB" class="ml-2">Двигать по линии</label>
          </div>

          <SliderPointValue v-model="B.X.pos.value" :min="B.X.min.value" :max="B.X.max.value" :step="B.X.step.value">
            x<sub>b</sub>
          </SliderPointValue>
          <SliderPointValue v-model="B.Y.pos.value" :min="B.Y.min.value" :max="B.Y.max.value" :step="B.Y.step.value">
            y<sub>b</sub>
          </SliderPointValue>
        </div>

      </template>
    </Fieldset>
  </div>
</template>
