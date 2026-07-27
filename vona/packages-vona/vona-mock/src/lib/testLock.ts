const pendingScenes = new Map<string, Promise<void>>();

export async function acquireTestLock(scene: string): Promise<() => void> {
  const previous = pendingScenes.get(scene) ?? Promise.resolve();
  let resolve: () => void;
  const pending = new Promise<void>(pendingResolve => {
    resolve = pendingResolve;
  });
  pendingScenes.set(scene, pending);
  await previous;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    resolve!();
    if (pendingScenes.get(scene) === pending) {
      pendingScenes.delete(scene);
    }
  };
}
