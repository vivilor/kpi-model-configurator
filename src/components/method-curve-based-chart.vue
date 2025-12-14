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
        Точка соединения фрагментов
      </template>

      <template #default>
        <div class="flex gap-2 items-center">
          <MessageValue class="italic font-serif"> x<sub>p</sub> </MessageValue>
          <Slider v-model="xP" :min="0" :max="2" :step="0.01" class="flex-auto" @update:modelValue="handlePChange" />
          <MessageValue> {{ xP.toFixed(2) }} </MessageValue>
        </div>
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

          <div class="flex gap-2 items-center">
            <MessageValue class="italic font-serif"> x<sub>a</sub> </MessageValue>
            <Slider v-model="xA" :min="0" :max="xP" :step="0.01" class="flex-auto"
              @update:modelValue="handleAChange('x')" />
            <MessageValue> {{ xA.toFixed(2) }} </MessageValue>
          </div>
          <div class="flex gap-2 items-center">
            <MessageValue class="italic font-serif"> y<sub>a</sub> </MessageValue>
            <Slider v-model="yA" :min="0" :max="yP" :step="0.01" class="flex-auto"
              @update:modelValue="handleAChange('y')" />
            <MessageValue> {{ yA.toFixed(2) }} </MessageValue>
          </div>
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

          <div class="flex gap-2 items-center">
            <MessageValue class="italic font-serif"> x<sub>a</sub> </MessageValue>
            <Slider v-model="xB" :max="2" :min="xP" :step="0.01" class="flex-auto"
              @update:modelValue="handleBChange('x')" />
            <MessageValue> {{ xB.toFixed(2) }} </MessageValue>
          </div>
          <div class="flex gap-2 items-center">
            <MessageValue class="italic font-serif"> y<sub>a</sub> </MessageValue>
            <Slider v-model="yB" :max="2" :min="yP" :step="0.01" class="flex-auto"
              @update:modelValue="handleBChange('y')" />
            <MessageValue> {{ yB.toFixed(2) }} </MessageValue>
          </div>
        </div>

      </template>
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import { Checkbox, Fieldset, Slider } from 'primevue'
import Chart from 'primevue/chart'
import { computed, ref } from 'vue'
import MessageValue from './message-value.vue'

// const chartRef = ref()

// Точка связки P
const xP = ref<number>(1.0)
const yP = computed(() => xP.value)
// const lockPToDiagonal = ref<boolean>(true)

// Точка для первого графика A
const xA = ref<number>(0.3)
const yA = ref<number>(0.3)
const lockAToLine = ref<boolean>(true)

// Точка для второго графика B
const xB = ref<number>(1.7)
const yB = ref<number>(1.7)
const lockBToLine = ref<boolean>(true)

// Параметры кривизны
// const t1 = computed<number>(() => yA.value - xA.value)
// const t2 = computed<number>(() => yB.value - xB.value)

// Обработка изменений точки P
const handlePChange = () => {

  // Обновляем ограничения для точек A и B
  if (xA.value > xP.value) xA.value = xP.value
  if (yA.value > yP.value) yA.value = yP.value
  if (xB.value < xP.value) xB.value = xP.value
  if (yB.value < yP.value) yB.value = yP.value

  // Если точки привязаны к линиям, пересчитываем их
  if (lockAToLine.value) {
    updatePointAOnLine()
  }
  if (lockBToLine.value) {
    updatePointBOnLine()
  }
}

// Обработка изменений точки A
const handleAChange = (changedAxis: 'x' | 'y') => {
  if (lockAToLine.value) {
    updatePointAOnLine(changedAxis)
  }

  // Проверяем границы
  xA.value = Math.max(0, Math.min(xA.value, xP.value))
  yA.value = Math.max(0, Math.min(yA.value, yP.value))
}

// Обработка изменений точки B
const handleBChange = (changedAxis: 'x' | 'y') => {
  if (lockBToLine.value) {
    updatePointBOnLine(changedAxis)
  }

  // Проверяем границы
  xB.value = Math.max(xP.value, Math.min(xB.value, 2))
  yB.value = Math.max(yP.value, Math.min(yB.value, 2))
}

// Обновление точки A на линии (0, yP) - (xP, 0)
const updatePointAOnLine = (changedAxis?: 'x' | 'y') => {
  // Уравнение линии: (x / xP) + (y / yP) = 1
  if (changedAxis === 'x') {
    // Вычисляем y по x
    if (xP.value > 0) {
      yA.value = yP.value * (1 - xA.value / xP.value)
    }
  } else {
    // Вычисляем x по y
    if (yP.value > 0) {
      xA.value = xP.value * (1 - yA.value / yP.value)
    }
  }
}

// Обновление точки B на линии (xP, 2) - (2, yP)
const updatePointBOnLine = (changedAxis?: 'x' | 'y') => {
  // Уравнение линии: (x - xP)/(2 - xP) + (y - yP)/(2 - yP) = 1
  const dx = 2 - xP.value
  const dy = 2 - yP.value

  if (changedAxis === 'x') {
    // Вычисляем y по x
    if (dx > 0) {
      yB.value = yP.value + dy * (1 - (xB.value - xP.value) / dx)
    }
  } else {
    // Вычисляем x по y
    if (dy > 0) {
      xB.value = xP.value + dx * (1 - (yB.value - yP.value) / dy)
    }
  }
}

// Функция для расчета кривой
const calculateCurve = (startX: number, endX: number, controlX: number, controlY: number, isFirstCurve: boolean): Array<{ x: number, y: number }> => {
  const points = []
  const steps = 100

  // Нормализуем контрольную точку относительно текущего отрезка
  let normalizedControlX, normalizedControlY

  if (isFirstCurve) {
    // Для первой кривой: от (0,0) до (xP, yP)
    normalizedControlX = (xA.value - startX) / (endX - startX)
    normalizedControlY = (yA.value - startX) / (endX - startX) // Для y используем ту же нормализацию
  } else {
    // Для второй кривой: от (xP, yP) до (2,2)
    normalizedControlX = (xB.value - startX) / (endX - startX)
    normalizedControlY = (yB.value - startX) / (endX - startX)
  }

  const t = normalizedControlY - normalizedControlX

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps
    const x = startX + progress * (endX - startX)
    const normalizedX = progress

    let normalizedY: number
    if (t <= 0) {
      // Правая дуга или промежуточное состояние
      normalizedY = (1 + t) * normalizedX + (-t) * (1 - Math.sqrt(1 - normalizedX * normalizedX))
    } else {
      // Левая дуга или промежуточное состояние
      normalizedY = (1 - t) * normalizedX + t * Math.sqrt(1 - (normalizedX - 1) * (normalizedX - 1))
    }

    // Денормализация
    const y = startX + normalizedY * (endX - startX)

    points.push({ x, y })
  }

  return points
}

// Генерация точек для графиков
const firstCurvePoints = computed(() => {
  return calculateCurve(0, xP.value, xA.value, yA.value, true)
})

const secondCurvePoints = computed(() => {
  return calculateCurve(xP.value, 2, xB.value, yB.value, false)
})

// Данные для графика
const chartData = computed<ChartData>(() => ({
  datasets: [
    // Первая кривая
    {
      label: 'Первая кривая (0,0 → P)',
      data: firstCurvePoints.value,
      borderColor: '#52c80e',
      backgroundColor: '#52c80e0f',
      tension: 0,
      fill: true,
      pointRadius: 1,
      borderWidth: 2
    },

    // Вторая кривая
    {
      label: 'Вторая кривая (P → 2,2)',
      data: secondCurvePoints.value,
      borderColor: '#52c80e',
      backgroundColor: '#52c80e20',
      tension: 0,
      fill: true,
      pointRadius: 1,
      borderWidth: 2
    },

    // Точка связки P
    {
      label: 'Точка связки P',
      data: [
        { x: xP.value, y: yP.value },
      ],
      borderDash: [5, 5],
      borderWidth: 1,
      pointRadius: 6,
      pointBackgroundColor: '#444444',
      pointBorderColor: '#FFF',
      pointBorderWidth: 2,
      // showLine: true
    },
    {
      data: [
        { x: 0, y: yP.value },
        { x: xP.value, y: yP.value },
        { x: xP.value, y: 0 },
      ],
      borderDash: [2, 10],
      borderWidth: 2,
      borderColor: '#FFF',
      borderCapStyle: 'round',
      fill: false,
      pointRadius: 0,
      // showLine: true
    },

    // Точка A
    {
      label: 'Точка A (кривизна 1)',
      data: [{ x: xA.value, y: yA.value }],
      pointRadius: 5,
      pointBackgroundColor: '#52c80e40',
      pointBorderColor: '#FFF',
      pointBorderWidth: 1,
      showLine: true
    },

    // Точка B
    {
      label: 'Точка B (кривизна 2)',
      data: [{ x: xB.value, y: yB.value }],
      pointRadius: 5,
      pointBackgroundColor: '#52c80e40',
      pointBorderColor: '#FFF',
      pointBorderWidth: 2,
      showLine: false
    },

    // Линия для точки A
    {
      label: 'Линия для A',
      data: [
        { x: 0, y: yP.value },
        { x: xP.value, y: 0 }
      ],
      borderWidth: 1,
      borderColor: '#ffffff33',
      borderDash: [10, 5],
      pointRadius: 0,
      fill: false
    },

    // Линия для точки B
    {
      label: 'Линия для B',
      data: [
        { x: xP.value, y: 2 },
        { x: 2, y: yP.value }
      ],
      borderWidth: 1,
      borderColor: '#ffffff33',
      borderDash: [10, 5],
      pointRadius: 0,
      fill: false
    },

    // Диагональ
    {
      label: 'y = x',
      data: [
        { x: 0, y: 0 },
        { x: 2, y: 2 }
      ],
      borderColor: '#9E9E9E',
      borderDash: [5, 5],
      pointRadius: 0,
      fill: false
    }
  ]
}
))

// Опции для Chart.js
const chartOptions: ChartOptions = {
  responsive: true,
  // maintainAspectRatio: true,
  aspectRatio: 1,
  animation: {
    duration: 0,
  },
  scales: {
    x: {
      beginAtZero: true,
      type: 'linear',
      position: 'bottom',
      min: 0,
      max: 2,
      title: {
        display: true,
        text: 'Уровень выполнения показателя'
      },
      grid: {
        color: '#ffffff22'
      }
    },
    y: {
      beginAtZero: true,
      min: 0,
      max: 2,
      title: {
        display: true,
        text: 'Размер коэффициента выполнения КПЭ'
      },
      grid: {
        color: '#ffffff22'
      }
    }
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  // interaction: {
  //   intersect: false,
  //   mode: 'nearest'
  // }
}

// Инициализация
const initialize = () => {
  handlePChange()
  updatePointAOnLine()
  updatePointBOnLine()
}

initialize()
</script>
