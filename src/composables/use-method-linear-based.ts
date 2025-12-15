import { useStorage } from "@vueuse/core"
import type { ChartOptions } from "chart.js"
import { computed } from "vue"
import { useRangedValue } from "./use-ranged-value"

export const useMethodLinearBased = (params: { keyPrefix: string }) => {
  const label = 'Линейный'

  const keyPrefix = params.keyPrefix + '.MethodLinearBased'

  const createKey = (key: string) => `${keyPrefix}.${key}`

  const visible = useStorage(createKey('visible'), true)

  const calculateQuarterBonusCoeff = (result: number) => {
    return result
  }

  const xBonusDeny = useRangedValue({
    keyPrefix,
    key: 'xBonusDeny',
    min: 0,
    step: 0.01,
    max: 2,
  })

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

  return {
    label,
    visible,
    chartOptions,
    xBonusDeny,
    calculateQuarterBonusCoeff,
  }
}