import { computed } from "vue"
import { useCaseParameters } from "./use-case-parameters"
import { useMethodStepsBased } from "./use-method-steps-based"
import { useQuarterResult } from "./use-quarter-result"
import type { ChartData, ChartOptions } from "chart.js"
import { useMethodCurveBased } from "./use-method-curve-based"
import { useMethodAccumBased } from "./use-method-accum-based"
import { useMethodLinearBased } from "./use-method-linear-based"
import { useStorage } from "@vueuse/core"

export const useApp = () => {
  const keyPrefix = 'App'

  const createKey = (key: string) => keyPrefix + '.' + key

  const CaseParameters = useCaseParameters()

  const Method = {
    Steps: useMethodStepsBased({ keyPrefix }),
    Linear: useMethodLinearBased({ keyPrefix }),
    Curve: useMethodCurveBased({ keyPrefix }),
    Accum: useMethodAccumBased({ keyPrefix }),
  }

  const methodTab = useStorage<keyof typeof Method>(createKey('methodTab'), 'Steps')
  const methodTabs = Object.entries(Method).map(([name, { label }]) => ({ name, label }))

  const QuarterResult = {
    I: useQuarterResult({ keyPrefix, key: 'I', title: '1 кв.', defaultValue: 0.9 }),
    II: useQuarterResult({ keyPrefix, key: 'II', title: '2 кв.', defaultValue: 1.4 }),
    III: useQuarterResult({ keyPrefix, key: 'III', title: '3 кв.', defaultValue: 2.0 }),
    IV: useQuarterResult({ keyPrefix, key: 'IV', title: '4 кв.', defaultValue: 1.0 })
  }

  const resultBonusesByYearMethodSteps = computed(() => Object.values(QuarterResult).map(({ result }) => CaseParameters.calculateQuarterBonus(Method.Steps.calculateQuarterBonusCoeff(result.pos.value))))
  const resultBonusesByYearMethodStepsSum = computed(() => resultBonusesByYearMethodSteps.value.reduce((a, b) => a + b, 0))
  const resultBonusesByYearMethodCurve = computed(() => Object.values(QuarterResult).map(({ result }) => CaseParameters.calculateQuarterBonus(Method.Curve.calculateQuarterBonusCoeff(result.pos.value))))
  const resultBonusesByYearMethodCurveSum = computed(() => resultBonusesByYearMethodCurve.value.reduce((a, b) => a + b, 0))
  const resultBonusesByYearMethodAccum = computed(() => Object.values(QuarterResult).map(({ result }) => CaseParameters.calculateQuarterBonus(Method.Accum.calculateQuarterBonusCoeff(result.pos.value))))
  const resultBonusesByYearMethodAccumSum = computed(() => resultBonusesByYearMethodAccum.value.reduce((a, b) => a + b, 0))
  const resultBonusesByYearMethodLinear = computed(() => Object.values(QuarterResult).map(({ result }) => CaseParameters.calculateQuarterBonus(Method.Linear.calculateQuarterBonusCoeff(result.pos.value))))
  const resultBonusesByYearMethodLinearSum = computed(() => resultBonusesByYearMethodLinear.value.reduce((a, b) => a + b, 0))

  const Chart = {
    Result: {
      data: computed<ChartData>(() => ({
        labels: Object.values(QuarterResult).map(({ title }) => title),
        datasets: [
          {
            label: 'Пошаговый',
            data: resultBonusesByYearMethodSteps.value,
            backgroundColor: ['#f9741533'],
            borderColor: ['#f97415'],
            borderWidth: 1,
            barThickness: 20
          },
          ...Method.Linear.visible.value ? [{
            label: 'Линейный',
            data: resultBonusesByYearMethodLinear.value,
            backgroundColor: ['#aaaaaa33'],
            borderColor: ['#aaaaaa'],
            borderWidth: 1,
            barThickness: 20
          }] : [],
          ...Method.Curve.visible.value ? [{
            label: 'Плавный',
            data: resultBonusesByYearMethodCurve.value,
            backgroundColor: ['#52c80e33'],
            borderColor: ['#52c80e'],
            borderWidth: 1,
            barThickness: 20
          }] : [],
          // ...Method.Accum.visible.value ? [{
          //   label: 'Корелляция',
          //   data: resultBonusesByYearMethodAccum.value,
          //   backgroundColor: ['#a307ab33'],
          //   borderColor: ['#a307ab'],
          //   borderWidth: 1,
          //   barThickness: 20
          // }] : [],
        ]
      })),
      options: computed<ChartOptions>(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        return {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            easing: "linear",
            duration: 0
          },
          plugins: {
            legend: {
              labels: {
                color: textColor,
                boxHeight: 15,
                boxWidth: 15
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: textColorSecondary
              },
              grid: {
                color: surfaceBorder
              },
              max: Math.ceil(CaseParameters.bonusByQuarterFull.value * 2 / 50000) * 50000
            }
          }
        };
      })
    }
  }

  const resultProbability = computed(() => Math.round(Object.values(QuarterResult).reduce((prob, r) => prob += r.prob.value / 4, 0) * 100))

  const randomizeQuartersResults = () => {
    QuarterResult.I.result.pos.value = (Math.random() * 2)
    QuarterResult.II.result.pos.value = (Math.random() * 2)
    QuarterResult.III.result.pos.value = (Math.random() * 2)
    QuarterResult.IV.result.pos.value = (Math.random() * 2)
  }

  return {
    Method,
    CaseParameters,
    QuarterResult,
    Chart,
    resultProbability,
    resultBonusesByYearMethodSteps,
    resultBonusesByYearMethodStepsSum,
    resultBonusesByYearMethodCurve,
    resultBonusesByYearMethodCurveSum,
    resultBonusesByYearMethodAccum,
    resultBonusesByYearMethodAccumSum,
    resultBonusesByYearMethodLinear,
    resultBonusesByYearMethodLinearSum,
    randomizeQuartersResults,
    methodTab,
    methodTabs
  }
}

