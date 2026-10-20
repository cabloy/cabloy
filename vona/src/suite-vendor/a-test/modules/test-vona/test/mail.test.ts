import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ServiceMail } from '../../../../a-vona/modules/a-mail/src/service/mail.ts';

describe('mail.test.ts', () => {
  it('consumes test-mode mail without reading client configuration or message content', async () => {
    const deleted: unknown[] = [];
    const messages: string[] = [];
    const own: any = {
      app: { meta: { isTest: true } },
      scope: {
        model: {
          mail: {
            async getById(id: number) {
              assert.equal(id, 1);
              return {
                get client() {
                  assert.fail('test-mode mail must not read the client');
                },
                get message() {
                  assert.fail('test-mode mail must not read message content');
                },
              };
            },
            async delete(where: unknown) {
              deleted.push(where);
            },
          },
        },
      },
      _getClient() {
        assert.fail('test-mode mail must not resolve a transport');
      },
      $logger: {
        info(message: string) {
          messages.push(message);
        },
      },
    };
    await ServiceMail.prototype.sendById.call(own, 1);
    assert.deepEqual(deleted, [{ id: 1 }]);
    assert.deepEqual(messages, ['Test mode: skipped external mail send.']);
  });

  it('leaves missing mail as a no-op', async () => {
    const own: any = {
      scope: {
        model: {
          mail: {
            async getById() {
              return undefined;
            },
            async delete() {
              assert.fail('missing mail must not be consumed');
            },
          },
        },
      },
      get app() {
        assert.fail('missing mail must return before checking runtime mode');
      },
      get $logger() {
        assert.fail('missing mail must not log suppression');
      },
    };
    await ServiceMail.prototype.sendById.call(own, 1);
  });

  it('preserves the missing-client error outside test mode', async () => {
    const own: any = {
      app: { meta: { isTest: false } },
      scope: {
        model: {
          mail: {
            async getById() {
              return { client: 'missing' };
            },
            async delete() {
              assert.fail('mail with missing configuration must not be consumed');
            },
          },
        },
      },
      _getClient(clientName: string) {
        assert.equal(clientName, 'missing');
        return undefined;
      },
      get $logger() {
        assert.fail('non-test mail must not log suppression');
      },
    };
    await assert.rejects(ServiceMail.prototype.sendById.call(own, 1), {
      message: 'config not found for mail client: missing',
    });
  });
});
