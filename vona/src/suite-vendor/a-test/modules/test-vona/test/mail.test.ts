import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe.skip('mail.test.ts', () => {
  it('action:mail', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.mail.send({
        to: 'someone@cabloy.com',
        subject: 'this is a test mail',
        text: 'message body!',
      });
    });
  });
});
