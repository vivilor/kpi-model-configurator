import { watch, type MaybeRef } from "vue"
import { makeFreeRef, makeRef } from "../utils"
import { useRefConnection } from "./use-ref-connection"

export const useRangedValue = (params: {
  keyPrefix: string
  key: string
  min?: MaybeRef<number>
  max?: MaybeRef<number>
  step?: MaybeRef<number>
  pos?: MaybeRef<number>

}) => {
  const keyPrefix = `${params.keyPrefix}.RangedValue.${params.key}`

  const createKey = (key: string) => `${keyPrefix}.${key}`

  const min = makeFreeRef(params?.min, 0)
  const max = makeFreeRef(params?.max, 1)
  const step = makeFreeRef(params?.step, 0.01)
  const pos = makeRef(createKey('pos'), params?.pos, 0.5)

  watch(min, v => {
    if (pos.value < v) {
      pos.value = v
    }

    if (max.value < min.value) {
      max.value = min.value
    }
  })

  watch(max, v => {
    if (pos.value > v) {
      pos.value = v
    }

    if (max.value < min.value) {
      min.value = max.value
    }
  })

  const [connectMin, disconnectMin] = useRefConnection(min)
  const [connectMax, disconnectMax] = useRefConnection(max)
  const [connectStep, disconnectStep] = useRefConnection(step)
  const [connectPos, disconnectPos] = useRefConnection(pos)

  return {

    min,
    max,
    pos,
    step,
    connectMin,
    connectMax,
    connectStep,
    connectPos,
    disconnectMin,
    disconnectMax,
    disconnectStep,
    disconnectPos,
  }
}
