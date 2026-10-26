import type {
  ICaptchaAuthorization,
  ICaptchaBinding,
  ICaptchaProviderData,
  ICaptchaProviderExecute,
} from 'vona-module-a-captcha';

import { createHash } from 'node:crypto';
import { BeanBase, uuidv4 } from 'vona';
import { CaptchaProvider } from 'vona-module-a-captcha';

export class CaptchaBoundContext {
  readonly token = uuidv4();
  readonly authorization: ICaptchaAuthorization;

  constructor(
    binding: ICaptchaBinding = {
      recipient: `${uuidv4()}@example.test`,
      purpose: 'captcha-regression',
      subject: uuidv4(),
    },
  ) {
    this.authorization = {
      binding,
      scope: createHash('sha256').update(JSON.stringify(binding)).digest('hex'),
      ip: createHash('sha256').update(uuidv4()).digest('hex'),
      ttl: 60_000,
      cooldown: 0,
      maxAttempts: 5,
      recipientLimits: [{ limit: 10, windowMs: 60_000 }],
      ipLimits: [{ limit: 10, windowMs: 60_000 }],
    };
  }
}

@CaptchaProvider()
export class CaptchaProviderBound extends BeanBase implements ICaptchaProviderExecute<string> {
  readonly bound = true;

  authorize(context: unknown) {
    if (this.app.meta.isTest && context instanceof CaptchaBoundContext) {
      return context.authorization;
    }
  }

  async create(_options: unknown, context?: unknown): Promise<ICaptchaProviderData<string>> {
    if (!this.app.meta.isTest || !(context instanceof CaptchaBoundContext)) {
      return this.app.throw(403);
    }
    return { token: context.token, payload: undefined };
  }

  async verify(token: string, tokenInput: string): Promise<boolean> {
    return token === tokenInput;
  }
}
