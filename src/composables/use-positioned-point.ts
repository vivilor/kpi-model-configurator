import { computed, type Ref } from "vue"
import { useRangedValue } from "./use-ranged-value"
import { makeRef } from "../utils"
import type { ChartData } from "chart.js"

export const usePositionedPoint = (params: {
  keyPrefix: string
  key: string
  minX?: Ref<number> | number
  maxX?: Ref<number> | number
  minY?: Ref<number> | number
  maxY?: Ref<number> | number
  stepX?: Ref<number> | number
  stepY?: Ref<number> | number
  posX?: Ref<number> | number
  posY?: Ref<number> | number
  label?: Ref<string> | string
}) => {
  const keyPrefix = params.keyPrefix + '.PositionedPoint.' + params.key
  const createKey = (key: string) => `${keyPrefix}.${key}`

  const X = useRangedValue({ keyPrefix, key: 'X', min: params?.minX, max: params?.maxX, step: params?.stepX, pos: params?.posX })
  const Y = useRangedValue({ keyPrefix, key: 'Y', min: params?.minY, max: params?.maxY, step: params?.stepY, pos: params?.posY })

  const label = makeRef(createKey('label'), params?.label, 'Точка')

  const pos = computed(() => ({
    x: X.pos.value,
    y: Y.pos.value
  }))

  const createLinesDataset = (styles: Partial<ChartData['datasets'][0]>): ChartData['datasets'][0] => ({
    label: label.value,
    data: [
      { x: 0, y: pos.value.y },
      pos.value,
      { x: pos.value.x, y: 0 },
    ],
    fill: false,
    pointRadius: 0,
    ...styles,
  })

  const isXInRange = (x: number) => (x <= X.max.value && x >= X.min.value)
  const isYInRange = (y: number) => (y <= Y.max.value && y >= Y.min.value)

  const calculateSalary = (x: number) => {
    const x1 = (X.min.value)
    const x2 = (X.max.value)
    const y1 = (Y.min.value)
    const y2 = (Y.max.value)

    const k = ((x2 - x1) < 10e-5) ? 1 : (y2 - y1) / (x2 - x1)
    const b = y1 - k * x1

    return k * x + b
  }

  return {
    X,
    Y,
    label,
    pos,
    isXInRange,
    isYInRange,
    calculateSalary,
    createLinesDataset
  }
}
