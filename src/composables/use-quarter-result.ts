import { computed, ref, type MaybeRef } from "vue"
import { useRangedValue } from "./use-ranged-value"
import { useProbabilityDistribution } from "./use-probability-distribution"

export const useQuarterResult = (params: {
  defaultValue: MaybeRef<number>
  title: string
  keyPrefix: string
  key: string
}) => {
  const keyPrefix = params.keyPrefix + '.QuarterResult.' + params.key
  // const createKey = (key: string) => `${keyPrefix}.${key}`

  const visible = ref(false)

  const { title } = params
  const result = useRangedValue({ keyPrefix, key: 'result', min: 0, max: 2, step: 0.01, pos: params?.defaultValue })

  const prob = computed(() => Dist.getDistributionValue(result.pos.value))

  const Dist = useProbabilityDistribution({
    keyPrefix
  })

  return {
    visible,
    Dist,
    title,
    result,
    prob
  }
}