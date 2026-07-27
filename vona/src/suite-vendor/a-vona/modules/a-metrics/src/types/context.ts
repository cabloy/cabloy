declare module 'vona' {
  export interface ContextState {
    metrics?: {
      internal?: boolean;
      startedAt?: bigint;
      completed?: () => boolean;
    };
  }
}
