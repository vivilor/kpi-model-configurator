<script setup lang="ts">
import { type ChartData, type ChartOptions } from 'chart.js';
import { Fieldset } from 'primevue';
import Chart from 'primevue/chart';
import { computed, inject } from 'vue';

const App = inject('App')

const { Point } = App.Method.Steps

const { currentPointKey } = App.Method.Steps

const getLinesStyles = (key: string): Partial<ChartData['datasets'][0]> => ({
  borderColor: currentPointKey.value === key ? '#CCC' : '#777',
  borderWidth: currentPointKey.value === key ? 3 : 2,
  borderDash: currentPointKey.value === key ? [8, 12] : [4, 6],
  borderCapStyle: 'round',
})

const chartData = computed<ChartData>(() => ({
  datasets: [
    {
      label: 'КПЭ',
      data: [
        Point.Minimal.pos.value,
        Point.Base.pos.value,
        Point.Excess1.pos.value,
        Point.Excess2.pos.value,
        Point.Ambitious.pos.value,
      ],
      borderColor: ['#f97415'],
    },
    ...Object.entries(Point).map(([key, point]) => point.createLinesDataset(getLinesStyles(key)))
  ],
}))


const chartOptions = computed<ChartOptions>(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          boxHeight: 0,
          color: textColor
        }
      }
    },
    aspectRatio: 1,
    scales: {
      x: {
        min: 0,
        max: 2,
        type: 'linear',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Уровень выполнения показателя'
        },
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        min: 0,
        max: 2,
        title: {
          display: true,
          text: 'Размер коэффициента выполнения КПЭ'
        },
        beginAtZero: true,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    },
  } as ChartOptions
})

</script>

<template>
  <Fieldset>
    <template #legend>
      График настройки шагового графика
    </template>
    <template #default>
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </template>
  </Fieldset>
</template>