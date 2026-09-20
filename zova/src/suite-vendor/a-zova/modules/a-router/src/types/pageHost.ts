export interface IPageHost {
  /**
   * Whether the concrete routed page instance is currently activated.
   *
   * This does not describe route selection, cache membership, visibility, or
   * data readiness.
   */
  readonly active: boolean;
}
