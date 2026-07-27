import assert from 'node:assert';
import { describe, it } from 'node:test';
import { acquireTestLock } from 'vona-mock';

describe('testLock.test.ts', () => {
  it('serializes same-scene callers in FIFO order', async () => {
    const scene = 'test-lock-fifo';
    const acquired: string[] = [];
    const releaseFirst = await acquireTestLock(scene);
    const second = acquireTestLock(scene).then(release => {
      acquired.push('second');
      return release;
    });
    const third = acquireTestLock(scene).then(release => {
      acquired.push('third');
      return release;
    });
    try {
      await Promise.resolve();
      assert.deepEqual(acquired, []);

      releaseFirst();
      const releaseSecond = await second;
      try {
        assert.deepEqual(acquired, ['second']);
        releaseSecond();
        const releaseThird = await third;
        try {
          assert.deepEqual(acquired, ['second', 'third']);
        } finally {
          releaseThird();
        }
      } finally {
        releaseSecond();
      }
    } finally {
      releaseFirst();
    }
  });

  it('does not block callers in different scenes', async () => {
    const releaseFirst = await acquireTestLock('test-lock-scene-a');
    const second = acquireTestLock('test-lock-scene-a');
    try {
      const releaseOther = await acquireTestLock('test-lock-scene-b');
      try {
        let secondAcquired = false;
        void second.then(() => {
          secondAcquired = true;
        });
        await Promise.resolve();
        assert.equal(secondAcquired, false);
      } finally {
        releaseOther();
      }
    } finally {
      releaseFirst();
      const releaseSecond = await second;
      releaseSecond();
    }
  });

  it('handles repeated releases and reuses completed scenes', async () => {
    const scene = 'test-lock-reuse';
    const releaseFirst = await acquireTestLock(scene);
    const second = acquireTestLock(scene);
    releaseFirst();
    releaseFirst();

    const releaseSecond = await second;
    releaseSecond();
    releaseSecond();

    const releaseThird = await acquireTestLock(scene);
    releaseThird();
  });
});
