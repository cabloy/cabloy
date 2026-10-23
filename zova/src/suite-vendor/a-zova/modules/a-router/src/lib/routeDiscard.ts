import type { IRouteDiscardEvent } from '../types/routeDiscard.ts';

export function dispatchRouteDiscard(
  event: Omit<IRouteDiscardEvent, 'waitUntil'>,
  emit: (event: IRouteDiscardEvent) => void,
  onError: (error: unknown) => void,
): Promise<void> {
  const cleanups: Promise<void>[] = [];
  const items = event.items.map(item => ({ ...item }));
  try {
    emit({
      ...event,
      items,
      waitUntil: cleanup => {
        cleanups.push(cleanup);
      },
    });
  } catch (error) {
    onError(error);
  }
  return Promise.allSettled(cleanups).then(results => {
    for (const result of results) {
      if (result.status === 'rejected') onError(result.reason);
    }
  });
}
