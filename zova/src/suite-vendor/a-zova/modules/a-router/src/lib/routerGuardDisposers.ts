export class RouterGuardDisposers {
  private _disposers: (() => void)[] = [];
  private _disposed = false;

  add(disposer: () => void) {
    this._disposers.push(disposer);
    return disposer;
  }

  dispose() {
    if (this._disposed) return;
    this._disposed = true;
    const disposers = this._disposers;
    this._disposers = [];
    for (const disposer of disposers) {
      disposer();
    }
  }
}
