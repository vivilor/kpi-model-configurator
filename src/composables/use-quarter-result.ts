import { ref, type MaybeRef } from "vue"
import { useRangedValue } from "./use-ranged-value"

export const useQuarterResult = (params: {
  defaultValue: MaybeRef<number>
  title: string
  keyPrefix: string
  key: string
}) => {
  const keyPrefix = params.keyPrefix + '.QuarterResult.' + params.key
  // const createKey = (key: string) => `${keyPrefix}.${key}`

  const { title } = params
  const result = useRangedValue({ keyPrefix, key: 'result', min: 0, max: 2, step: 0.01, pos: params?.defaultValue })

  const prob = ref(0.5)

  return {
    title,
    result,
    prob
  }
}