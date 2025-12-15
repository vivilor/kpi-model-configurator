<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js';
import { Fieldset } from 'primevue';
import Chart from 'primevue/chart';
import { computed } from 'vue';

const chartData = computed<ChartData>(() => ({
  datasets: [
    {
      data: [
        {
          x: 0,
          y: 0
        },
        {
          x: 1,
          y: 1
        },
        {
          x: 2,
          y: 2
        }
      ],
      borderColor: '#aaaaaa',
      tension: 0,
      fill: false,
      pointRadius: 0,
      borderWidth: 2
    },
  ]
}
))


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
</script>

<template>
  <Fieldset>
    <template #legend>
      График линейный <span class="font-serif italic">y = x</span>
    </template>
    <template #default>
      <Chart type="line" :data="chartData" :options="chartOptions" />
    </template>
  </Fieldset>
</template>