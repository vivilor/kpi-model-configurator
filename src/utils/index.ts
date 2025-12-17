import { useStorage } from "@vueuse/core";
import { isRef, ref, type MaybeRef } from "vue";

export const makeRef = <T>(name: string, v: MaybeRef<T> | undefined, defaultValue: T) => isRef(v) ? v : useStorage(name, v ?? defaultValue)

export const makeFreeRef = <T>(v: MaybeRef<T> | undefined, defaultValue: T) => isRef(v) ? v : ref(v ?? defaultValue)