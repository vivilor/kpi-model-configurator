import { useStorage } from "@vueuse/core"
import type { ChartData, ChartOptions } from "chart.js"
import { computed } from "vue"
import { useXBonusDeny } from "./use-x-bonus-deny"

export const useMethodLinearBased = (params: { keyPrefix: string }) => {
  const label = 'Линейный'

  const keyPrefix = params.keyPrefix + '.MethodLinearBased'

  const createKey = (key: string) => `${keyPrefix}.${key}`

  const visible = useStorage(createKey('visible'), true)

  const calculateQuarterBonusCoeff = (result: number) => {
    if (result <= xBonusDeny.pos.value) {
      return 0
    }

    return result
  }

  const xBonusDeny = useXBonusDeny({
    keyPrefix
  })


  const chartData = computed<ChartData>(() => ({
    datasets: [
      {
        data: [
          {
            x: xBonusDeny.pos.value,
            y: xBonusDeny.pos.value,
          },
          {
            x: 4,
            y: 4
          }
        ],
        borderColor: '#aaaaaa',
        tension: 0,
        fill: false,
        pointRadius: 0,
        borderWidth: 2
      },
      {
        data: [
          {
            x: 0,
            y: 0
          },
          {
            x: xBonusDeny.pos.value,
            y: xBonusDeny.pos.value,
          }
        ],
        borderColor: '#aa1100',
        tension: 0,
        fill: false,
        pointRadius: 0,
        borderWidth: 2
      },
      {
        data: [
          {
            x: 0,
            y: xBonusDeny.pos.value,
          },
          {
            x: xBonusDeny.pos.value,
            y: xBonusDeny.pos.value,
          },
          {
            x: xBonusDeny.pos.value,
            y: 0,
          }
        ],
        pointBackgroundColor: '#aa1100',
        pointBorderColor: '#fff',
        pointBorderWidth: '2',
        pointRadius: 5,
        borderRadius: 1,
        borderDash: [10, 5],
        borderCapStyle: 'round',
        fill: true,
        backgroundColor: '#aa110011',
        borderColor: '#aa110088'
      }
    ]
  }
  ))

  const chartOptions = computed<ChartOptions>(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: 0,
      },
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

  return {
    label,
    visible,
    chartData,
    chartOptions,
    xBonusDeny,
    calculateQuarterBonusCoeff,
  }
}