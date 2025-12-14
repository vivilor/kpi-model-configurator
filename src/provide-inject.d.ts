import type { useApp } from "./composables/use-app";

declare module "vue" {
  export declare function provide(key: 'App', value: ReturnType<typeof useApp>)
  /**
   * 
   * @see {@link useApp}
   */
  export declare function inject(key: 'App'): ReturnType<typeof useApp>
}