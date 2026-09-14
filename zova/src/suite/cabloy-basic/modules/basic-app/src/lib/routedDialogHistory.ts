import type { RouterHistory } from '@cabloy/vue-router';

import { createMemoryHistory } from '@cabloy/vue-router';

export class RoutedDialogHistory {
  private readonly sourceHistory = createMemoryHistory();
  private position = 0;
  private length = 1;
  private listeners = new Set<(canGoBack: boolean) => void>();
  public readonly history: RouterHistory;

  constructor() {
    const sourceHistory = this.sourceHistory;
    this.history = {
      get base() {
        return sourceHistory.base;
      },
      get location() {
        return sourceHistory.location;
      },
      get state() {
        return sourceHistory.state;
      },
      createHref: (...args) => sourceHistory.createHref(...args),
      push: (...args) => {
        this._push();
        sourceHistory.push(...args);
      },
      replace: (...args) => {
        sourceHistory.replace(...args);
      },
      go: (...args) => {
        const [delta] = args;
        const position = Math.max(0, Math.min(this.position + delta, this.length - 1));
        this._setPosition(position);
        sourceHistory.go(...args);
      },
      listen: (...args) => sourceHistory.listen(...args),
      destroy: () => {
        sourceHistory.destroy();
      },
    };
  }

  public get canGoBack() {
    return this.position > 0;
  }

  public onCanGoBackChange(listener: (canGoBack: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public destroy() {
    this.history.destroy();
    this.position = 0;
    this.length = 1;
    this.listeners.clear();
  }

  private _push() {
    this.length = this.position + 2;
    this._setPosition(this.position + 1);
  }

  private _setPosition(position: number) {
    const canGoBack = this.canGoBack;
    this.position = position;
    if (this.canGoBack === canGoBack) return;
    for (const listener of this.listeners) {
      listener(this.canGoBack);
    }
  }
}
