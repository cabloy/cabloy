import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { z } from 'zod';

const messages = {
  'en-us': 'Too small: expected string to have >=2 characters',
  'zh-cn': '数值过小：期望 string >=2 字符',
  'ja-jp': '小さすぎる値: stringは2文字以上である必要があります',
  'zh-tw': '數值過小：預期 string 應為 >=2 字元',
};

function assertValidationMessage(locale: keyof typeof messages) {
  const result = z.string().min(2).safeParse('x');
  assert.equal(result.success, false);
  assert.equal(result.error!.issues.length, 1);
  assert.equal(result.error!.issues[0].code, 'too_small');
  assert.equal(result.error!.issues[0].message, messages[locale]);
}

describe('application locale policy and home-base Zod mappings', { concurrency: false }, () => {
  it('actual startup enables four languages and retains the English default', () => {
    assert.deepEqual(Object.keys(app.config.locale.items), Object.keys(messages));
    assert.equal(app.config.locale.default, 'en-us');
  });

  it('startup mapping follows each independent context without per-request registration', async () => {
    for (const locale of Object.keys(messages) as (keyof typeof messages)[]) {
      await app.bean.executor.mockCtx(
        async () => {
          assert.equal(app.ctx.locale, locale);
          assert.equal(app.meta.locale.current, locale);
          assertValidationMessage(locale);
        },
        { locale },
      );
    }
  });

  it('missing and unsupported locale inputs use the configured default', async () => {
    await app.bean.executor.mockCtx(async () => {
      assert.equal(app.ctx.locale, 'en-us');
      assertValidationMessage('en-us');
      app.ctx.locale = 'unsupported' as any;
      assert.equal(app.ctx.locale, 'en-us');
      assertValidationMessage('en-us');
    });
  });
});
