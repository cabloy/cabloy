import type { Component } from 'vue';

import type { IBehaviorItem, IBehaviorRecord } from '../types/behavior.js';

export function $UseBehavior<T extends keyof IBehaviorRecord>(
  behaviorName: T,
  options?: Partial<IBehaviorRecord[T]>,
): IBehaviorItem {
  return { [behaviorName]: options };
}

export function $UseBehaviorTag(component: string | Component) {
  return {
    component,
    name: typeof component === 'string' ? component : undefined,
  };
}
