import { useStorage } from "@vueuse/core"

export const useMethodCurveBased = (params: { keyPrefix: string }) => {
  const label = 'Плавный'

  const keyPrefix = params.keyPrefix + '.MethodCurveBased'

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