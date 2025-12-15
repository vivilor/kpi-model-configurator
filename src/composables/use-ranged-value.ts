import { watch, type MaybeRef } from "vue"
import { makeRef } from "../utils"
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

  const min = makeRef(createKey('min'), params?.min, 0)
  const max = makeRef(createKey('max'), params?.max, 1)
  const step = makeRef(createKey('step'), params?.step, 0.01)
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
  const [connectStep, disconnectStep] = useRefConnection(min)
  const [connectPos, disconnectPos] = useRefConnection(min)

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
