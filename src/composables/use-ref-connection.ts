import { watch, type ComputedRef, type Ref } from "vue"

export const useRefConnection = <T>(target: Ref<T>) => {
  let stopWatch: (() => unknown) | undefined

  const connect = (source: Ref<T> | ComputedRef<T>) => {
    watch(source, v => {
      target.value = v
    }, { immediate: true })
  }

  const disconnect = () => {
    stopWatch?.()
  }

  return [connect, disconnect] as const
}
