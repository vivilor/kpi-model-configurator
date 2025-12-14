import { useStorage } from "@vueuse/core"

export const useMethodLinearBased = (params: { keyPrefix: string }) => {
  const label = 'Линейный'

  const keyPrefix = params.keyPrefix + '.MethodLinearBased'

  const createKey = (key: string) => `${keyPrefix}.${key}`

  const visible = useStorage(createKey('visible'), true)

  const calculateQuarterBonusCoeff = (result: number) => {
    return result
  }

  return {
    label,
    visible,
    calculateQuarterBonusCoeff
  }
}