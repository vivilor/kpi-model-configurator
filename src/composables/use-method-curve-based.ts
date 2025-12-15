import { useStorage } from "@vueuse/core"
import type { ChartData, ChartOptions } from "chart.js"
import { computed, watch } from "vue"
import { usePositionedPoint } from "./use-positioned-point"
import { useXBonusDeny } from "./use-x-bonus-deny"

export const useMethodCurveBased = (params: { keyPrefix: string }) => {
  const label = 'Плавный'
  const keyPrefix = params.keyPrefix + '.MethodCurveBased'
  const createKey = (key: string) => `${keyPrefix}.${key}`

  const visible = useStorage(createKey('visible'), true)
  const lockAToLine = useStorage<boolean>(createKey('lockAToLine'), true)
  const lockBToLine = useStorage<boolean>(createKey('lockBToLine'), true)

  // Точка P
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

  // Привязка P к диагонали y=x
  P.Y.connectPos(P.X.pos)
  // P.X.connectPos(P.Y.pos)

  // Точка A (для первой кривой: от 0,0 до P)
  const A = usePositionedPoint({
    keyPrefix,
    key: 'A',
    minX: 0,
    posX: 0.3,
    minY: 0,
    posY: 0.3,
    maxX: P.X.pos, // Связываем максимальный X с позицией P
    maxY: P.Y.pos, // Связываем максимальный Y с позицией P
  })

  // Точка B (для второй кривой: от P до 2,2)
  const B = usePositionedPoint({
    keyPrefix,
    key: 'B',
    minX: P.X.pos, // Связываем минимальный X с позицией P
    minY: P.Y.pos, // Связываем минимальный Y с позицией P
    posX: 1.7,
    maxX: 2,
    posY: 1.7,
    maxY: 2,
  })

  // Исправленные функции для привязки к линиям
  const updateAonLine = () => {
    if (!lockAToLine.value || P.X.pos.value <= 0 || P.Y.pos.value <= 0) {
      return
    }

    // Уравнение линии для A: x/xP + y/yP = 1
    // Вычисляем y по x: y = yP * (1 - x/xP)
    const x = A.X.pos.value
    const y = P.Y.pos.value * (1 - x / P.X.pos.value)

    // Устанавливаем новую позицию Y
    A.Y.pos.value = Math.max(A.Y.min.value, Math.min(y, A.Y.max.value))
  }

  const updateBonLine = () => {
    if (!lockBToLine.value) {
      return
    }

    const dx = 2 - P.X.pos.value
    const dy = 2 - P.Y.pos.value

    if (dx <= 0 || dy <= 0) {
      return
    }

    // Уравнение линии для B: (x - xP)/dx + (y - yP)/dy = 1
    // Вычисляем y по x: y = yP + dy * (1 - (x - xP)/dx)
    const x = B.X.pos.value
    const y = P.Y.pos.value + dy * (1 - (x - P.X.pos.value) / dx)

    // Устанавливаем новую позицию Y
    B.Y.pos.value = Math.max(B.Y.min.value, Math.min(y, B.Y.max.value))
  }

  // Следим за изменениями для автоматического обновления
  watch([lockAToLine, () => A.X.pos.value, () => P.X.pos.value, () => P.Y.pos.value],
    () => {
      if (lockAToLine.value) {
        updateAonLine()
      }
    },
    { immediate: true }
  )

  watch([lockBToLine, () => B.X.pos.value, () => P.X.pos.value, () => P.Y.pos.value],
    () => {
      if (lockBToLine.value) {
        updateBonLine()
      }
    },
    { immediate: true }
  )

  // Также обновляем границы при движении точки P
  watch(() => P.X.pos.value, (newX) => {
    // Обновляем максимальные границы для A
    if (A.X.max.value !== newX) {
      A.X.max.value = newX
    }
    // Обновляем минимальные границы для B
    if (B.X.min.value !== newX) {
      B.X.min.value = newX
    }
  })

  watch(() => P.Y.pos.value, (newY) => {
    // Обновляем максимальные границы для A
    if (A.Y.max.value !== newY) {
      A.Y.max.value = newY
    }
    // Обновляем минимальные границы для B
    if (B.Y.min.value !== newY) {
      B.Y.min.value = newY
    }
  })

  // Исправленная функция расчета кривой
  const calculateCurve = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    controlX: number,
    controlY: number
  ) => {
    const points: Array<{ x: number, y: number }> = []
    const steps = 100

    // Нормализуем контрольную точку относительно текущего отрезка
    const normControlX = (controlX - startX) / (endX - startX)
    const normControlY = (controlY - startY) / (endY - startY)
    const t = normControlY - normControlX

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      const x = startX + progress * (endX - startX)
      const normalizedX = progress

      let normalizedY: number
      if (t <= 0) {
        // Правая дуга или промежуточное состояние
        normalizedY = (1 + t) * normalizedX + (-t) * (1 - Math.sqrt(1 - normalizedX * normalizedX))
      } else {
        // Левая дуга или промежуточное состояние
        normalizedY = (1 - t) * normalizedX + t * Math.sqrt(1 - (normalizedX - 1) * (normalizedX - 1))
      }

      // Денормализация
      const y = startY + normalizedY * (endY - startY)
      points.push({ x, y })
    }

    return points
  }

  // Точки для первой кривой (от 0,0 до P)
  const firstCurvePoints = computed(() =>
    calculateCurve(0, 0, P.X.pos.value, P.Y.pos.value, A.X.pos.value, A.Y.pos.value)
  )

  // Точки для второй кривой (от P до 2,2)
  const secondCurvePoints = computed(() =>
    calculateCurve(P.X.pos.value, P.Y.pos.value, 2, 2, B.X.pos.value, B.Y.pos.value)
  )

  // Функция для расчета бонусного коэффициента
  const calculateQuarterBonusCoeff = (result: number) => {
    if (result < xBonusDeny.pos.value) {
      return 0
    }

    // Ищем y для заданного x на соответствующей кривой
    if (result <= P.X.pos.value) {
      // На первой кривой
      const points = firstCurvePoints.value
      // Линейный поиск ближайшей точки
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i]!
        const p2 = points[i + 1]!

        if (result >= p1.x && result <= p2.x) {
          // Линейная интерполяция
          const t = (result - p1.x) / (p2.x - p1.x)
          return p1.y + t * (p2.y - p1.y)
        }
      }
      return 0
    } else {
      // На второй кривой
      const points = secondCurvePoints.value
      // Линейный поиск ближайшей точки
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i]!
        const p2 = points[i + 1]!

        if (result >= p1.x && result <= p2.x) {
          // Линейная интерполяция
          const t = (result - p1.x) / (p2.x - p1.x)
          return p1.y + t * (p2.y - p1.y)
        }
      }
      return 0
    }
  }

  const xBonusDeny = useXBonusDeny({
    keyPrefix,
  })

  const yBonusDeny = computed(() => calculateQuarterBonusCoeff(xBonusDeny.pos.value))

  // Исправленный chartData
  const chartData = computed<ChartData>(() => ({
    datasets: [
      // Первая кривая (0,0 → P)
      {
        type: 'line',
        label: 'Первая кривая',
        data: firstCurvePoints.value,
        borderColor: '#52c80e',
        backgroundColor: '#52c80e0f',
        tension: 0,
        fill: true,
        pointRadius: 0,
        borderWidth: 2
      },

      // Вторая кривая (P → 2,2)
      {
        type: 'line',
        label: 'Вторая кривая',
        data: secondCurvePoints.value,
        borderColor: '#52c80e',
        backgroundColor: '#52c80e20',
        tension: 0,
        fill: true,
        pointRadius: 0,
        borderWidth: 2
      },

      // Точка связки P
      {
        type: 'scatter',
        label: 'Точка связки P',
        data: [P.pos.value],
        pointRadius: 8,
        pointBackgroundColor: '#444444',
        pointBorderColor: '#FFF',
        pointBorderWidth: 2,
      },

      // Линия от (0,yP) до P до (xP,0)
      {
        type: 'line',
        data: [
          { x: 0, y: P.Y.pos.value },
          P.pos.value,
          { x: P.X.pos.value, y: 0 }
        ],
        borderDash: [2, 10],
        borderWidth: 1,
        borderColor: '#FFF',
        fill: false,
        pointRadius: 0,
      },

      // Точка A
      {
        type: 'scatter',
        label: 'Точка A',
        data: [A.pos.value],
        pointRadius: 6,
        pointBackgroundColor: '#2196F3',
        pointBorderColor: '#FFF',
        pointBorderWidth: 1,
      },

      // Точка B
      {
        type: 'scatter',
        label: 'Точка B',
        data: [B.pos.value],
        pointRadius: 6,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#FFF',
        pointBorderWidth: 2,
      },

      // Линия для точки A (пунктирная направляющая)
      {
        type: 'line',
        label: 'Линия для A',
        data: [
          { x: 0, y: P.Y.pos.value },
          { x: P.X.pos.value, y: 0 }
        ],
        borderWidth: 1,
        borderColor: '#ffffff33',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      },

      // Линия для точки B (пунктирная направляющая)
      {
        type: 'line',
        label: 'Линия для B',
        data: [
          { x: P.X.pos.value, y: 2 },
          { x: 2, y: P.Y.pos.value }
        ],
        borderWidth: 1,
        borderColor: '#ffffff33',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      },

      // Диагональ y=x
      {
        type: 'line',
        label: 'y = x',
        data: [
          { x: 0, y: 0 },
          { x: 2, y: 2 }
        ],
        borderColor: '#9E9E9E',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false
      },

      {
        data: [
          {
            x: 0,
            y: yBonusDeny.value,
          },
          {
            x: xBonusDeny.pos.value,
            y: yBonusDeny.value,
          },
          {
            x: xBonusDeny.pos.value,
            y: 0,
          }
        ],
        pointBackgroundColor: '#aa1100',
        pointBorderColor: '#fff',
        pointBorderWidth: '2',
        pointRadius: 5,
        borderRadius: 1,
        borderDash: [10, 5],
        borderCapStyle: 'round',
        fill: true,
        backgroundColor: '#aa110011',
        borderColor: '#aa110088'
      }
    ]
  }))

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
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
        },
        ticks: {
          stepSize: 0.2
        }
      },
      y: {
        min: 0,
        max: 2,
        title: {
          display: true,
          text: 'Размер коэффициента выполнения КПЭ'
        },
        grid: {
          color: '#ffffff22'
        },
        ticks: {
          stepSize: 0.2
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw as { x: number, y: number }
            return `${context.dataset.label || ''}: (${point.x.toFixed(2)}, ${point.y.toFixed(2)})`
          }
        }
      }
    },
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
    firstCurvePoints,
    secondCurvePoints,
  }
}