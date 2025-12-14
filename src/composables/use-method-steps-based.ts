import { useStorage } from "@vueuse/core"
import { computed } from "vue"
import { usePositionedPoint } from "./use-positioned-point"

export const useMethodStepsBased = (params: { keyPrefix: string }) => {
  const label = 'Пошаговый'

  const keyPrefix = params.keyPrefix + '.MethodStepsBased'

  const createKey = (key: string) => `${keyPrefix}.${key}`

  const visible = useStorage(createKey('visible'), true)

  const Point = {
    Minimal: usePositionedPoint({ keyPrefix, key: 'Minimal', label: 'Минимум', minX: 0, minY: 0, posX: 0.8, posY: 0.8 }),
    Base: usePositionedPoint({ keyPrefix, key: 'Base', label: 'База', posX: 1, posY: 1 }),
    Excess1: usePositionedPoint({ keyPrefix, key: 'Excess1', label: 'Перевып. 1', posX: 1.5, posY: 1.25 }),
    Excess2: usePositionedPoint({ keyPrefix, key: 'Excess2', label: 'Перевып. 2', posX: 1.75, posY: 1.5 }),
    Ambitious: usePositionedPoint({ keyPrefix, key: 'Ambitious', label: 'АмЦель', maxX: 2, maxY: 2, posX: 2, posY: 2 }),
  }

  Point.Minimal.X.connectMax(Point.Base.X.pos)
  Point.Minimal.Y.connectMax(Point.Base.Y.pos)

  Point.Base.X.connectMin(Point.Minimal.X.pos)
  Point.Base.Y.connectMin(Point.Minimal.Y.pos)

  Point.Base.X.connectMax(Point.Excess1.X.pos)
  Point.Base.Y.connectMax(Point.Excess1.Y.pos)

  Point.Excess1.X.connectMin(Point.Base.X.pos)
  Point.Excess1.Y.connectMin(Point.Base.Y.pos)

  Point.Excess1.X.connectMax(Point.Excess2.X.pos)
  Point.Excess1.Y.connectMax(Point.Excess2.Y.pos)

  Point.Excess2.X.connectMin(Point.Excess1.X.pos)
  Point.Excess2.Y.connectMin(Point.Excess1.Y.pos)

  Point.Excess2.X.connectMax(Point.Ambitious.X.pos)
  Point.Excess2.Y.connectMax(Point.Ambitious.Y.pos)

  Point.Ambitious.X.connectMin(Point.Excess2.X.pos)
  Point.Ambitious.Y.connectMin(Point.Excess2.Y.pos)

  const pointSelectOptions = Object.keys(Point).map(key => ({
    value: key,
    label: Point[key as keyof typeof Point].label.value
  }))

  const currentPointKey = useStorage<keyof typeof Point>(createKey('currentPoint'), 'Minimal')

  const currentPoint = computed(() => Point[currentPointKey.value])

  const reset = () => {
    Point.Minimal.X.pos.value = 0.8
    Point.Minimal.Y.pos.value = 0.8
    Point.Base.X.pos.value = 1.0
    Point.Base.Y.pos.value = 1.0
    Point.Excess1.X.pos.value = 1.5
    Point.Excess1.Y.pos.value = 1.25
    Point.Excess2.X.pos.value = 1.75
    Point.Excess2.Y.pos.value = 1.5
    Point.Ambitious.X.pos.value = 2.0
    Point.Ambitious.Y.pos.value = 2.0
  }

  // reset()

  const calculateQuarterBonusCoeff = (result: number) => {
    if (result > Point.Ambitious.X.pos.value) {
      return Point.Ambitious.Y.pos.value
    }

    if (result < Point.Minimal.X.pos.value) {
      return 0
    }

    for (const point of Object.values(Point)) {
      if (point.isXInRange(result)) {
        return point.calculateSalary(result)
      }
    }


    return 0
  }

  return {
    label,
    Point,
    visible,
    currentPointKey,
    pointSelectOptions,
    currentPoint,
    reset,
    calculateQuarterBonusCoeff,
  }
}