let pending = Promise.resolve();

export async function acquireTestLock(): Promise<() => void> {
  const previous = pending;
  let release: () => void;
  pending = new Promise<void>(resolve => {
    release = resolve;
  });
  await previous;
  return release!;
}
