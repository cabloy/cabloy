import assert from 'node:assert/strict';

export function boundedProof() {
  let sequence = 0;
  let bytes = 0;
  return (event: (sequence: number) => object) => {
    assert.equal(sequence < 512, true, 'event_count_limit');
    const line = JSON.stringify(event(++sequence));
    const length = Buffer.byteLength(line);
    assert.equal(length <= 512, true, 'event_byte_limit');
    assert.equal(bytes + length <= 256 * 1024, true, 'total_event_byte_limit');
    bytes += length;
    return line;
  };
}
