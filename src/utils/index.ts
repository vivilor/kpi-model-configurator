import { useStorage } from "@vueuse/core";
import { isRef, type MaybeRef } from "vue";

export const makeRef = <T>(name: string, v: MaybeRef<T> | undefined, defaultValue: T) => isRef(v) ? v : useStorage(name, v ?? defaultValue)