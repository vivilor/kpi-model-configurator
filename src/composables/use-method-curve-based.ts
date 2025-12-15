import { useStorage } from "@vueuse/core"
import { useRangedValue } from "./use-ranged-value"
import { computed, watch } from "vue"
import { usePositionedPoint } from "./use-positioned-point"
import type { ChartData, ChartOptions } from "chart.js"

export const useMethodCurveBased = (params: { keyPrefix: string }) => {
  const label = 'Плавный'

  const keyPrefix = params.keyPrefix + '.MethodCurveBased'

  const createKey = (key: string) => `${keyPrefix}.${key}`

  const visible = useStorage(createKey('visible'), true)

  const lockAToLine = useStorage<boolean>(createKey('lockAToLine'), true)
  const lockBToLine = useStorage<boolean>(createKey('lockBToLine'), true)


  const P = usePositionedPoint({
    keyPrefix,
    key: 'P',
    minX: 0,
    posX: 1,
    maxX: 2,
    minY: 0,
    posY: 1,
    maxY: 2,
  })

  P.Y.connectPos(P.X.pos)

  const A = usePositionedPoint({
    keyPrefix,
    key: 'A',
    minX: 0,
    posX: 0.3,
    minY: 0,
    posY: 0.3,
  })

  A.X.connectMax(P.X.pos)
  A.Y.connectMax(P.Y.pos)

  const B = usePositionedPoint({
    keyPrefix,
    key: 'B',
    posX: 1.7,
    maxX: 2,
    posY: 1.7,
    maxY: 2,
  })

  B.X.connectMin(P.X.pos)
  B.Y.connectMin(P.Y.pos)


  watch(lockAToLine, v => {
    if (v) {
      A.X.connectPos(computed(() => {
        if (P.X.pos.value > P.X.min.value) {
          return P.Y.pos.value * (1 - A.X.pos.value / P.X.pos.value)
        } else {
          return A.X.pos.value
        }
      }))
      A.Y.connectPos(computed(() => {
        if (P.Y.pos.value > P.Y.min.value) {
          return P.X.pos.value * (1 - A.Y.pos.value / P.Y.pos.value)
        } else {
          return A.Y.pos.value
        }
      }))
    } else {
      A.X.disconnectPos()
      A.Y.disconnectPos()
    }
  }, {
    immediate: true
  })

  watch(lockBToLine, v => {
    if (v) {
      B.X.connectPos(computed(() => {
        const dx = P.X.max.value - P.X.pos.value
        const dy = P.Y.max.value - P.Y.pos.value

        if (dy > 0) {
          return P.Y.pos.value + dy * (1 - (B.X.pos.value - P.X.pos.value) / dx)
        } else {
          return B.X.pos.value
        }
      }))
      B.Y.connectPos(computed(() => {
        const dx = P.X.max.value - P.X.pos.value
        const dy = P.Y.max.value - P.Y.pos.value

        if (dy > 0) {
          return P.X.pos.value + dx * (1 - (B.Y.pos.value - P.Y.pos.value) / dy)
        } else {
          return B.Y.pos.value
        }
      }))
    } else {
      B.X.disconnectPos()
      B.Y.disconnectPos()
    }
  }, {
    immediate: true
  })

  const calculateCurvePoint = (x: number, p: ReturnType<typeof usePositionedPoint>) => {
    const startX = P.X.min.value
    const endX = p.X.max.value

    const xC = (p.X.pos.value - startX) / (endX - startX)
    const yC = (p.Y.pos.value - startX) / (endX - startX)

    const t = yC - xC

    if (t <= 0) {
      // Правая дуга или промежуточное состояние
      return (1 + t) * x + (-t) * (1 - Math.sqrt(1 - x * x))
    } else {
      // Левая дуга или промежуточное состояние
      return (1 - t) * x + t * Math.sqrt(1 - (x - 1) * (x - 1))
    }
  }

  const calculateQuarterBonusCoeff = (result: number) => {
    if (result < xBonusDeny.pos.value) {
      return 0
    }

    if (A.isXInRange(result)) {
      return calculateCurvePoint(result, A)
    } else if (B.isXInRange(result)) {
      return calculateCurvePoint(result, B)
    } else {
      return 0
    }
  }

  const calculateCurvePoints = (p: ReturnType<typeof usePositionedPoint>) => {
    const points: Array<{ x: number, y: number }> = []

    for (let x = p.X.min.value; x <= p.X.max.value; x += p.X.step.value) {
      points.push({
        x,
        y: calculateCurvePoint(x, p)
      })
    }

    return points
  }

  const xBonusDeny = useRangedValue({
    keyPrefix,
    key: 'xBonusDeny',
    min: 0,
    step: 0.01,
    max: 2,
  })

  const chartData = computed<ChartData>(() => ({
    datasets: [
      // Первая кривая
      {
        label: 'Первая кривая',
        data: calculateCurvePoints(A),
        borderColor: '#52c80e',
        backgroundColor: '#52c80e0f',
        tension: 0,
        fill: true,
        pointRadius: 1,
        borderWidth: 2
      },

      // Вторая кривая
      {
        label: 'Вторая кривая',
        data: calculateCurvePoints(B),
        borderColor: '#52c80e',
        backgroundColor: '#52c80e20',
        tension: 0,
        fill: true,
        pointRadius: 1,
        borderWidth: 2
      },

      // Точка связки P
      {
        label: 'Точка связки P',
        data: [P.pos.value],
        borderDash: [5, 5],
        borderWidth: 1,
        pointRadius: 6,
        pointBackgroundColor: '#444444',
        pointBorderColor: '#FFF',
        pointBorderWidth: 2,
        // showLine: true
      },
      {
        data: [
          { x: 0, y: P.Y.pos.value },
          P.pos.value,
          { x: P.X.pos.value, y: 0 },
        ],
        borderDash: [2, 10],
        borderWidth: 2,
        borderColor: '#FFF',
        borderCapStyle: 'round',
        fill: false,
        pointRadius: 0,
      },

      // Точка A
      {
        label: 'Точка A (кривизна 1)',
        data: [A.pos.value],
        pointRadius: 5,
        pointBackgroundColor: '#52c80e40',
        pointBorderColor: '#FFF',
        pointBorderWidth: 1,
        showLine: true
      },

      // Точка B
      {
        label: 'Точка B (кривизна 2)',
        data: [B.pos.value],
        pointRadius: 5,
        pointBackgroundColor: '#52c80e40',
        pointBorderColor: '#FFF',
        pointBorderWidth: 2,
        showLine: false
      },

      // Линия для точки A
      {
        label: 'Линия для A',
        data: [
          { x: 0, y: P.Y.pos.value },
          { x: P.X.pos.value, y: 0 }
        ],
        borderWidth: 1,
        borderColor: '#ffffff33',
        borderDash: [10, 5],
        pointRadius: 0,
        fill: false
      },

      // Линия для точки B
      {
        label: 'Линия для B',
        data: [
          { x: P.X.pos.value, y: 2 },
          { x: 2, y: P.Y.pos.value }
        ],
        borderWidth: 1,
        borderColor: '#ffffff33',
        borderDash: [10, 5],
        pointRadius: 0,
        fill: false
      },

      // Диагональ
      {
        label: 'y = x',
        data: [
          { x: 0, y: 0 },
          { x: 2, y: 2 }
        ],
        borderColor: '#9E9E9E',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      }
    ]
  }
  ))

  const chartOptions: ChartOptions = {
    responsive: true,
    // maintainAspectRatio: true,
    aspectRatio: 1,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        beginAtZero: true,
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 2,
        title: {
          display: true,
          text: 'Уровень выполнения показателя'
        },
        grid: {
          color: '#ffffff22'
        }
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 2,
        title: {
          display: true,
          text: 'Размер коэффициента выполнения КПЭ'
        },
        grid: {
          color: '#ffffff22'
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    // interaction: {
    //   intersect: false,
    //   mode: 'nearest'
    // }
  }



  return {
    A,
    B,
    P,
    lockAToLine,
    lockBToLine,
    label,
    visible,
    calculateQuarterBonusCoeff,
    xBonusDeny,
    chartData,
    chartOptions,
  }
}