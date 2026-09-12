import type { TableIdentity } from 'table-identity';

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

import type { IRbacScopeAccess } from '../src/types/scope.ts';

function createAccess(
  onCheck?: (entries: readonly { id: TableIdentity }[]) => void,
): IRbacScopeAccess {
  return {
    action: {} as never,
    decision: {} as never,
    unrestricted: false,
    ownerValues: () => ({}),
    where: () => undefined,
    checkEntry: () => {},
    checkEntries: entries => onCheck?.(entries as readonly { id: TableIdentity }[]),
    permissionProjection: () => ({ key: '', allowed: true, matcher: { mode: 'all' } }),
  };
}

function assertScopedError(errorName: string, status: number) {
  return (error: Error) => error.code === `a-rbac:${errorName}` && error.status === status;
}

describe('resourceBulk.test.ts', { concurrency: false }, () => {
  it('rejects invalid IDs before loading with scoped errors', async () => {
    await app.bean.executor.mockCtx(async () => {
      let loads = 0;
      const load = async () => {
        loads += 1;
        return [];
      };
      await assert.rejects(
        () => app.bean.rbacResourceBulk.entries([], load, createAccess()),
        assertScopedError('1001', 422),
      );
      await assert.rejects(
        () => app.bean.rbacResourceBulk.entries([undefined as never], load, createAccess()),
        assertScopedError('1003', 422),
      );
      await assert.rejects(
        () => app.bean.rbacResourceBulk.entries(['1', '1'], load, createAccess()),
        assertScopedError('1004', 422),
      );
      assert.equal(loads, 0);
    });
  });

  it('requires full coverage and preserves requested order for authorization', async () => {
    await app.bean.executor.mockCtx(async () => {
      let checked: readonly { id: TableIdentity }[] | undefined;
      const entries = await app.bean.rbacResourceBulk.entries(
        ['2', '1'],
        async () => [{ id: '1' }, { id: '2' }],
        createAccess(value => {
          checked = value;
        }),
      );
      assert.deepEqual(
        entries.map(entry => entry.id),
        ['2', '1'],
      );
      assert.deepEqual(
        checked?.map(entry => entry.id),
        ['2', '1'],
      );

      await assert.rejects(
        () =>
          app.bean.rbacResourceBulk.entries(['1', '2'], async () => [{ id: '1' }], createAccess()),
        assertScopedError('1005', 404),
      );
    });
  });

  it('runs authorization only after complete scoped loading', async () => {
    await app.bean.executor.mockCtx(async () => {
      let calls = 0;
      let loads = 0;
      await assert.rejects(
        () =>
          app.bean.rbacResourceBulk.entries(
            ['1', '2'],
            async () => {
              loads += 1;
              return [{ id: '1' }];
            },
            createAccess(() => {
              calls += 1;
            }),
          ),
        assertScopedError('1005', 404),
      );
      assert.equal(loads, 1);
      assert.equal(calls, 0);

      await assert.rejects(
        () =>
          app.bean.rbacResourceBulk.entries(
            ['1'],
            async () => [{ id: '1' }],
            createAccess(() => {
              throw new Error('forbidden');
            }),
          ),
        /forbidden/,
      );
    });
  });

  it('localizes scoped errors', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        await assert.rejects(
          () => app.bean.rbacResourceBulk.entries([], async () => [], createAccess()),
          (error: Error) =>
            error.code === 'a-rbac:1001' &&
            error.status === 422 &&
            error.message === '批量资源 ID 不能为空',
        );
      },
      { locale: 'zh-cn' },
    );
  });
});
