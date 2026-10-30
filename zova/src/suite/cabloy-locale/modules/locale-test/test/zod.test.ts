import assert from 'node:assert/strict';
import { test } from 'node:test';
import { z } from 'zod';

import { AppUtil } from '../../../../../../packages-zova/zova-core/src/core/app/util.ts';
import { AppLocale } from '../../../../../../packages-zova/zova-core/src/core/component/locale.ts';
import rootConfig from '../../../../../front/config/config/config.ts';
import { Main as HomeBase } from '../../../../a-home/modules/home-base/src/main.ts';

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

test('actual root policy preserves the English fallback and supported environment override', () => {
  for (const value of [undefined, '', 'en-us', 'ja-jp']) {
    const config = rootConfig({ env: { APP_LOCALE_DEFAULT: value } } as any);
    assert.deepEqual(Object.keys(config.locale!.items!), Object.keys(messages));
    assert.equal(config.locale!.default, value || 'en-us');
  }
});

test('actual home-base initialization registers all four mappings only on the client', async t => {
  const env = process.env as Record<string, string | undefined>;
  const previous = env.CLIENT;
  const previousZodConfig = { ...z.config() };
  t.after(() => {
    if (previous === undefined) delete env.CLIENT;
    else env.CLIENT = previous;
    z.config(previousZodConfig);
  });

  const sys: any = { env: {} };
  sys.config = rootConfig(sys);
  const app: any = {
    meta: { cookie: { getItem: () => undefined, setItem() {} } },
  };
  const locale = Object.assign(new AppLocale(), {
    sys,
    app,
    ctx: { meta: { $ssr: { profileOptions: { useCookie: true } } } },
  });
  app.meta.locale = locale;
  app.util = Object.assign(new AppUtil(), { app });
  const homeBase = Object.assign(new HomeBase(), { sys, app });

  env.CLIENT = 'true';
  await homeBase.moduleLoaded();
  for (const language of Object.keys(messages) as (keyof typeof messages)[]) {
    locale.current = language;
    assert.equal(locale.current, language);
    assertValidationMessage(language);
  }
  locale.current = undefined;
  assert.equal(locale.current, 'en-us');
  assertValidationMessage('en-us');
  locale.current = 'unsupported' as any;
  assert.equal(locale.current, 'en-us');
  assertValidationMessage('en-us');

  delete env.CLIENT;
  const beforeServerInit = z.config().localeError;
  const serverHomeBase = Object.assign(new HomeBase(), {
    sys,
    app: {
      util: {
        setLocaleErrors() {
          assert.fail('server initialization must not register Zod locales');
        },
      },
    },
  });
  await serverHomeBase.moduleLoaded();
  assert.equal(z.config().localeError, beforeServerInit);
});
