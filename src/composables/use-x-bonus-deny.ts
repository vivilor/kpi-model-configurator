import { computed } from "vue"
import { useRangedValue } from "./use-ranged-value"

export const useXBonusDeny = (params: {
  keyPrefix: string
}) => {
  const X = useRangedValue({
    ...params,
    key: 'xBonusDeny',
    min: 0,
    step: 0.01,
    max: 2,
  })

  const chartDataDatasets = computed(() => [
    {
      data: [
        {
          x: 0,
          y: X.pos.value,
        },
        {
          x: X.pos.value,
          y: X.pos.value,
        },
        {
          x: X.pos.value,
          y: 0,
        }
      ],
      pointBackgroundColor: '#aa2200',
      pointBorderColor: '#fff',
      pointBorderWidth: '2',
      pointRadius: 5,
      borderRadius: 1,
      borderDash: [10, 5],
      borderCapStyle: 'round',
      borderColor: '#aa220088'
    }
  ])

  return {
    ...X,
    chartDataDatasets
  }
}