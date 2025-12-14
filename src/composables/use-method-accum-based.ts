import { useStorage } from "@vueuse/core"

export const useMethodAccumBased = (params: { keyPrefix: string }) => {
  const label = 'Корелляция'

  const keyPrefix = params.keyPrefix + '.MethodAccumBased'

  const createKey = (key: string) => `${keyPrefix}.${key}`

  const visible = useStorage(createKey('visible'), true)

  const calculateQuarterBonusCoeff = (result: number) => {
    return result ? Math.random() * 2 : Math.random() * 2
  }

  return {
    label,
    visible,
    calculateQuarterBonusCoeff
  }
}