import type { Page, Request } from '@playwright/test';

import { createHash } from 'node:crypto';

export type ClientResourceTarget = {
  label: string;
  pathname: string;
  sha256: string;
};

type ResourceRecord = {
  document: number;
  label: string;
  status: number | null;
  outcome: 'requested' | 'finished' | 'failed' | 'body-unavailable';
  sha256: string | null;
  matches: boolean | null; // null until an actual response body is hashed.
};

// Observe only caller-selected same-origin static resources; never retain URLs or bodies.
export function observeClientResources(
  page: Page,
  origin: string,
  targets: readonly ClientResourceTarget[],
) {
  const records: ResourceRecord[] = [];
  const requests = new Map<Request, { record: ResourceRecord; target: ClientResourceTarget }>();
  const pending = new Set<Promise<void>>();
  let document = 0;
  let dropped = 0;
  let otherScripts = 0;
  let disposed = false;
  const onRequest = (request: Request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) document++;
    const url = new URL(request.url());
    if (request.resourceType() !== 'script') return;
    const target = targets.find(target => target.pathname === url.pathname);
    if (url.origin !== origin || url.search || url.hash || !target) {
      otherScripts++;
      return;
    }
    if (records.length >= 100) {
      dropped++;
      return;
    }
    const record: ResourceRecord = {
      document,
      label: target.label,
      status: null,
      outcome: 'requested',
      sha256: null,
      matches: null,
    };
    records.push(record);
    requests.set(request, { record, target });
  };
  const onFinished = (request: Request) => {
    const entry = requests.get(request);
    if (!entry) return;
    requests.delete(request);
    const task = (async () => {
      try {
        const response = await request.response();
        if (!response || disposed) return;
        entry.record.status = response.status();
        if (entry.record.status === 304) {
          entry.record.outcome = 'body-unavailable';
          return;
        }
        const body = await response.body();
        if (disposed) return;
        entry.record.sha256 = createHash('sha256').update(body).digest('hex');
        entry.record.matches = entry.record.sha256 === entry.target.sha256;
        entry.record.outcome = 'finished';
      } catch {
        if (!disposed) entry.record.outcome = 'body-unavailable';
      }
    })();
    pending.add(task);
    void task.finally(() => pending.delete(task));
  };
  const onFailed = (request: Request) => {
    const entry = requests.get(request);
    if (!entry) return;
    entry.record.outcome = 'failed';
    requests.delete(request);
  };
  const dispose = () => {
    disposed = true;
    page.off('request', onRequest);
    page.off('requestfinished', onFinished);
    page.off('requestfailed', onFailed);
    page.off('close', dispose);
    requests.clear();
  };
  page.on('request', onRequest);
  page.on('requestfinished', onFinished);
  page.on('requestfailed', onFailed);
  page.once('close', dispose);
  return {
    async snapshot() {
      await Promise.all([...pending]);
      return { document, dropped, otherScripts, records: records.map(record => ({ ...record })) };
    },
    dispose,
  };
}
