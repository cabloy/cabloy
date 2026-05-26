import type { ComputedGetter, DebuggerOptions, WritableComputedOptions } from 'vue';

import { computed } from 'vue';

export function useComputed<T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): T;
export function useComputed<T>(
  options: WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
): T;
export function useComputed(options, debugOptions) {
  return computed(options, debugOptions);
}
