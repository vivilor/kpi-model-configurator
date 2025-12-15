import { useStorage } from "@vueuse/core"
import { computed, ref, watch } from "vue"
import type { ChartData, ChartOptions } from "chart.js"

export const useProbabilityDistribution = (params: { keyPrefix: string }) => {
  const label = 'Распределение вероятности'
  const keyPrefix = params.keyPrefix + '.ProbabilityDistribution'

  const createKey = (key: string) => `${keyPrefix}.${key}`

  const visible = useStorage(createKey('visible'), true)

  // Точки распределения
  // Точка 1: начальная (x1, y1)
  const x1 = useStorage(createKey('x1'), 0)
  const y1 = useStorage(createKey('y1'), 0)

  // Точка 2: средняя/контрольная (x2, y2)
  const x2 = useStorage(createKey('x2'), 1)
  const y2 = useStorage(createKey('y2'), 1)

  // Точка 3: конечная (x3, y3)
  const x3 = useStorage(createKey('x3'), 2)
  const y3 = useStorage(createKey('y3'), 0)

  // Ограничения для точек
  const minX = ref(0)
  const maxX = ref(2)
  const minY = ref(0)
  const maxY = ref(1) // 100% = 1.0

  // Наблюдатели для валидации
  watch([x1, x2, x3], () => {
    // Упорядочиваем X по возрастанию
    const values = [x1.value, x2.value, x3.value].sort((a, b) => a - b)

    // Перезаписываем в правильном порядке
    x1.value = values[0]
    x2.value = values[1]
    x3.value = values[2]

    // Убеждаемся, что X в пределах [0, 2]
    x1.value = Math.max(minX.value, Math.min(x1.value, maxX.value))
    x2.value = Math.max(minX.value, Math.min(x2.value, maxX.value))
    x3.value = Math.max(minX.value, Math.min(x3.value, maxX.value))
  }, { immediate: true })

  watch([y1, y2, y3], () => {
    // Убеждаемся, что Y в пределах [0, 1]
    y1.value = Math.max(minY.value, Math.min(y1.value, maxY.value))
    y2.value = Math.max(minY.value, Math.min(y2.value, maxY.value))
    y3.value = Math.max(minY.value, Math.min(y3.value, maxY.value))
  }, { immediate: true })

  // Функция для расчета кривой распределения (квадратичная Безье с контрольной точкой)
  const calculateDistributionPoint = (x: number): number => {
    // Если x вне диапазона точек
    if (x < x1.value) {
      return y1.value
    }
    if (x > x3.value) {
      return y3.value
    }

    // Параметрическая кривая Безье через 3 точки
    // В данном случае используем квадратичную кривую Безье
    // где P1 = (x1, y1), P2 = (x2, y2) - контрольная точка, P3 = (x3, y3)

    // Находим параметр t для заданного x
    // x(t) = (1-t)²*x1 + 2*(1-t)*t*x2 + t²*x3
    // Решаем квадратное уравнение относительно t

    // Коэффициенты квадратного уравнения: a*t² + b*t + c = 0
    const a = x1.value - 2 * x2.value + x3.value
    const b = 2 * (x2.value - x1.value)
    const c = x1.value - x

    let t: number

    if (Math.abs(a) < 1e-6) {
      // Линейный случай
      t = -c / b
    } else {
      // Квадратное уравнение
      const D = b * b - 4 * a * c
      if (D < 0) {
        // Дискриминант отрицательный, используем приближение
        t = (x - x1.value) / (x3.value - x1.value)
      } else {
        const sqrtD = Math.sqrt(D)
        const t1 = (-b + sqrtD) / (2 * a)
        const t2 = (-b - sqrtD) / (2 * a)

        // Выбираем t в диапазоне [0, 1]
        t = (t1 >= 0 && t1 <= 1) ? t1 : t2
        t = Math.max(0, Math.min(1, t))
      }
    }

    // Вычисляем y по найденному t
    // y(t) = (1-t)²*y1 + 2*(1-t)*t*y2 + t²*y3
    const y = (1 - t) * (1 - t) * y1.value + 2 * (1 - t) * t * y2.value + t * t * y3.value

    return Math.max(0, Math.min(1, y))
  }

  // Альтернативный вариант: кубический сплайн через 3 точки
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const calculateDistributionPointSpline = (x: number): number => {
    if (x <= x1.value) return y1.value
    if (x >= x3.value) return y3.value

    // Для 3 точек используем квадратичную интерполяцию
    // Интерполируем между отрезками

    if (x <= x2.value) {
      // Между точками 1 и 2
      const t = (x - x1.value) / (x2.value - x1.value)
      // Линейная интерполяция с учетом контрольной точки
      const controlInfluence = (y2.value - y1.value) * t
      return y1.value + controlInfluence * (1 + t) / 2
    } else {
      // Между точками 2 и 3
      const t = (x - x2.value) / (x3.value - x2.value)
      // Линейная интерполяция с учетом контрольной точки
      const controlInfluence = (y3.value - y2.value) * t
      return y2.value + controlInfluence * (2 - t) / 2
    }
  }

  // Функция для получения значения распределения в точке x
  const getDistributionValue = (x: number): number => {
    return calculateDistributionPoint(x)
  }

  // Генерация точек для графика
  const distributionPoints = computed(() => {
    const points: Array<{ x: number, y: number }> = []
    const steps = 200

    for (let i = 0; i <= steps; i++) {
      const x = minX.value + (maxX.value - minX.value) * (i / steps)
      const y = getDistributionValue(x)
      points.push({ x, y })
    }

    return points
  })

  // Площадь под кривой (интеграл распределения)
  const areaUnderCurve = computed(() => {
    const points = distributionPoints.value
    let area = 0

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]!
      const curr = points[i]!
      // Метод трапеций
      area += (curr.x - prev.x) * (prev.y + curr.y) / 2
    }

    return area
  })

  // Медиана распределения (значение x при котором площадь слева = справа)
  const medianX = computed(() => {
    const totalArea = areaUnderCurve.value
    let accumulatedArea = 0
    const points = distributionPoints.value

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]!
      const curr = points[i]!
      const segmentArea = (curr.x - prev.x) * (prev.y + curr.y) / 2

      if (accumulatedArea + segmentArea >= totalArea / 2) {
        // Находим точное значение методом линейной интерполяции
        const targetArea = totalArea / 2 - accumulatedArea
        const t = targetArea / segmentArea
        return prev.x + (curr.x - prev.x) * t
      }

      accumulatedArea += segmentArea
    }

    return points[Math.floor(points.length / 2)]!.x
  })

  // Данные для графика
  const chartData = computed<ChartData<'line'>>(() => ({
    datasets: [
      // Кривая распределения
      {
        label: 'Плотность распределения',
        data: distributionPoints.value,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2
      },

      // Точка 1
      {
        label: 'Начальная точка',
        data: [{ x: x1.value, y: y1.value }],
        pointRadius: 8,
        pointBackgroundColor: '#FF5722',
        pointBorderColor: '#FFF',
        pointBorderWidth: 2,
        showLine: false
      },

      // Точка 2
      {
        label: 'Контрольная точка',
        data: [{ x: x2.value, y: y2.value }],
        pointRadius: 8,
        pointBackgroundColor: '#FFC107',
        pointBorderColor: '#FFF',
        pointBorderWidth: 2,
        showLine: false
      },

      // Точка 3
      {
        label: 'Конечная точка',
        data: [{ x: x3.value, y: y3.value }],
        pointRadius: 8,
        pointBackgroundColor: '#4CAF50',
        pointBorderColor: '#FFF',
        pointBorderWidth: 2,
        showLine: false
      },

      // Вертикальная линия медианы
      {
        label: 'Медиана',
        data: [
          { x: medianX.value, y: 0 },
          { x: medianX.value, y: getDistributionValue(medianX.value) }
        ],
        borderColor: '#9C27B0',
        borderDash: [5, 5],
        pointRadius: 0,
        borderWidth: 2,
        fill: false
      }
    ]
  }))

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: minX.value,
        max: maxX.value,
        title: {
          display: true,
          text: 'Значение переменной (X)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        // ticks: {
        //   callback: (value) => value.toFixed(1)
        // }
      },
      y: {
        min: minY.value,
        max: maxY.value,
        title: {
          display: true,
          text: 'Вероятность / Плотность'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          callback: (value) => `${(Number(value) * 100).toFixed(0)}%`
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw as { x: number, y: number }
            const percentage = (point.y * 100).toFixed(1)
            return `${context.dataset.label}: X=${point.x.toFixed(2)}, Y=${percentage}%`
          }
        }
      }
    }
  }

  return {
    // Точки
    x1, y1,
    x2, y2,
    x3, y3,

    // Границы
    minX, maxX,
    minY, maxY,

    // Вычисляемые значения
    getDistributionValue,
    distributionPoints,
    areaUnderCurve,
    medianX,

    // Для графика
    label,
    visible,
    chartData,
    chartOptions,

    // Методы для работы с распределением
    resetToDefaults: () => {
      x1.value = 0
      y1.value = 0
      x2.value = 1
      y2.value = 1
      x3.value = 2
      y3.value = 0
    },

    // Примеры пресетов
    setUniformDistribution: () => {
      x1.value = 0
      y1.value = 0.5
      x2.value = 1
      y2.value = 0.5
      x3.value = 2
      y3.value = 0.5
    },

    setNormalDistribution: () => {
      x1.value = 0
      y1.value = 0
      x2.value = 1
      y2.value = 1
      x3.value = 2
      y3.value = 0
    },

    setLeftSkewed: () => {
      x1.value = 0
      y1.value = 1
      x2.value = 0.5
      y2.value = 0.5
      x3.value = 2
      y3.value = 0
    },

    setRightSkewed: () => {
      x1.value = 0
      y1.value = 0
      x2.value = 1.5
      y2.value = 0.5
      x3.value = 2
      y3.value = 1
    }
  }
}