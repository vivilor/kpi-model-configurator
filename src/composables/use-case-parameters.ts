import { computed, ref } from "vue"

export const useCaseParameters = () => {
  const salary = ref(250000)
  const bonusPct = ref(25)

  const bonusRatio = computed(() => bonusPct.value / 100)
  const bonusByYearFull = computed(() => salary.value * 12 * bonusRatio.value)
  const bonusByQuarterFull = computed(() => salary.value * 3 * bonusRatio.value)

  const calculateQuarterBonus = (coeff: number) => Math.round(coeff * bonusByQuarterFull.value)

  return {
    salary,
    bonusPct,
    bonusRatio,
    bonusByYearFull,
    bonusByQuarterFull,
    calculateQuarterBonus
  }
}