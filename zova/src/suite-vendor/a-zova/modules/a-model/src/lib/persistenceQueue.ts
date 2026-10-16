export class PersistenceQueue {
  private _tail: Promise<unknown> = Promise.resolve();
  private _sequence = 0;
  private _failure?: { sequence: number; error: unknown };
  private _generation = 0;
  private _keyGenerations = new Map<string, number>();

  generation(key: string): string {
    return `${this._generation}:${this._keyGenerations.get(key) ?? 0}`;
  }

  invalidate(key: string) {
    this._keyGenerations.set(key, (this._keyGenerations.get(key) ?? 0) + 1);
  }

  invalidateAll() {
    this._generation++;
    this._keyGenerations.clear();
  }

  enqueue<T>(operation: () => T | PromiseLike<T>): Promise<T> {
    const sequence = ++this._sequence;
    const result = this._tail.then(operation);
    this._tail = result.catch(error => {
      this._failure ??= { sequence, error };
    });
    return result;
  }

  async flush(): Promise<void> {
    const sequence = this._sequence;
    await this._tail;
    if (this._failure && this._failure.sequence <= sequence) {
      const { error } = this._failure;
      this._failure = undefined;
      throw error;
    }
  }
}

const queues = new WeakMap<object, PersistenceQueue>();

export function getPersistenceQueue(storage: object): PersistenceQueue {
  let queue = queues.get(storage);
  if (!queue) {
    queue = new PersistenceQueue();
    queues.set(storage, queue);
  }
  return queue;
}
