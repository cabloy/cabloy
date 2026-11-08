import type { Writable } from 'node:stream';
import type { run } from 'node:test';

import { PassThrough } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { lcov, spec } from 'node:test/reporters';

export async function reportTestResults(
  testStream: ReturnType<typeof run>,
  output: Writable,
  coverageOutput?: Writable,
): Promise<void> {
  // Pipe broadcasts each event to both reporters; composed async iterators would compete for events.
  const specEvents = new PassThrough({ objectMode: true });
  const reporters = [
    pipeline(specEvents.compose(spec), output, { end: false }),
    pipeline(testStream, specEvents),
  ];
  if (coverageOutput) {
    const coverageEvents = new PassThrough({ objectMode: true });
    reporters.push(
      pipeline(coverageEvents.compose(lcov), coverageOutput),
      pipeline(testStream, coverageEvents),
    );
  }
  const results = await Promise.allSettled(reporters);
  for (const result of results) {
    if (result.status === 'rejected') throw result.reason;
  }
}
