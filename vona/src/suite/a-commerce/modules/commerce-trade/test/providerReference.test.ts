import assert from 'node:assert';
import { describe, it } from 'node:test';

import { compactProviderReference } from '../src/lib/providerReference.ts';

describe('providerReference.test.ts', () => {
  it('keeps fitting values and compacts long values with a domain-separated digest', () => {
    const maxLength = 100;
    const sharedPrefix = 'provider-event-'.padEnd(100, 'x');
    const first = `${sharedPrefix}A`;
    const second = `${sharedPrefix}B`;

    assert.equal(compactProviderReference('payment-event', 'event-1', maxLength), 'event-1');
    assert.equal(
      compactProviderReference('payment-event', 'x'.repeat(maxLength), maxLength),
      'x'.repeat(maxLength),
    );

    const reference = compactProviderReference('payment-event', first, maxLength);
    assert.equal(reference.length, 'payment-event:'.length + 43);
    assert.equal(reference, compactProviderReference('payment-event', first, maxLength));
    assert.notEqual(reference, compactProviderReference('payment-event', second, maxLength));
    assert.notEqual(reference, compactProviderReference('refund-event', first, maxLength));
    assert.match(reference, /^payment-event:[\w-]{43}$/);
  });

  it('rejects a maximum length that cannot hold its compact reference', () => {
    assert.throws(
      () => compactProviderReference('payment-event', 'x'.repeat(101), 10),
      /maximum length is too small/,
    );
  });
});
