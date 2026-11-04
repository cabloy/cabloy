import type {
  ICaptchaProviderData,
  ICaptchaProviderExecute,
  IDecoratorCaptchaProviderOptions,
} from 'vona-module-a-captcha';

import { getRandomInt } from '@cabloy/utils';
import svgCaptcha, { ConfigObject } from '@zhennann/svg-captcha';
import fse from 'fs-extra';
import { parse as opentypeParse } from 'opentype.js/dist/opentype.mjs';
import svg64 from 'svg64';
import { BeanBase, cast, uuidv4 } from 'vona';
import { CaptchaProvider } from 'vona-module-a-captcha';

export type TypeCaptchaProviderImageTextToken = string;
export type TypeCaptchaProviderImageTextPayload = string;
export type TypeCaptchaProviderImageTextData = ICaptchaProviderData<
  TypeCaptchaProviderImageTextToken,
  TypeCaptchaProviderImageTextPayload
>;

export interface ICaptchaImageTextState {
  token?: string;
  token2?: string;
  revision: string;
  ttlSecondary: number;
}

export type TypeCaptchaProviderImageTextType = 'char' | 'math';
const CaptchaProviderImageTextTypes = ['char', 'math'] as const;
export interface ICaptchaProviderOptionsImageText extends IDecoratorCaptchaProviderOptions {
  type?: TypeCaptchaProviderImageTextType;
  fontPath?: string;
  opts: ConfigObject;
}

@CaptchaProvider<ICaptchaProviderOptionsImageText>({
  opts: {
    size: 4,
    color: true,
  },
})
export class CaptchaProviderImageText
  extends BeanBase
  implements
    ICaptchaProviderExecute<TypeCaptchaProviderImageTextToken, TypeCaptchaProviderImageTextPayload>
{
  async create(
    options: ICaptchaProviderOptionsImageText,
    _payload?: unknown,
    previousToken?: string,
  ): Promise<TypeCaptchaProviderImageTextData> {
    const cache = this.$scope.captcha.cacheRedis.captcha;
    const snapshot = previousToken
      ? await cache.snapshot<ICaptchaImageTextState>(previousToken)
      : undefined;
    if (previousToken !== undefined && !previousToken.startsWith('imageText:')) {
      return this.app.throw(403);
    }
    const { ttl, ttlSecondary } = this._policy(options);
    await this._confirmFont(options);
    let type = options.type;
    if (!type) {
      type = CaptchaProviderImageTextTypes[getRandomInt(2, 0)];
    }
    const captcha =
      type === 'char' ? svgCaptcha.create(options.opts) : svgCaptcha.createMathExpr(options.opts);
    const token = snapshot ? previousToken! : `imageText:${uuidv4()}`;
    const written = await cache.writeProof(
      token,
      { token: captcha.text, revision: uuidv4(), ttlSecondary },
      ttl,
      snapshot,
    );
    if (!written.changed) return this.app.throw(403);
    return {
      token,
      tokenPublic: captcha.text,
      payload: svg64(captcha.data),
      serverNow: written.serverNow,
      expiresAt: written.expiresAt,
      routingExpiresAt: written.expiresAt + ttlSecondary,
    };
  }

  async verify(
    token: string,
    tokenInput: unknown,
    _options: ICaptchaProviderOptionsImageText,
  ): Promise<boolean> {
    const cache = this.$scope.captcha.cacheRedis.captcha;
    const snapshot = await cache.snapshot<ICaptchaImageTextState>(token);
    if (!snapshot || !token.startsWith('imageText:')) return false;
    const data = snapshot.data;
    if (data.token2) {
      const consumed = await cache.compareAndSet(token, snapshot);
      return consumed && data.token2 === tokenInput;
    }
    if (!data.token) return false;
    const verified = this._matches(data.token, tokenInput);
    const changed = await cache.compareAndSet(
      token,
      snapshot,
      verified ? undefined : { ...data, token: undefined, revision: uuidv4() },
    );
    return verified && changed;
  }

  async verifyImmediate(
    token: string,
    tokenInput: unknown,
    _options: ICaptchaProviderOptionsImageText,
  ): Promise<false | string> {
    const cache = this.$scope.captcha.cacheRedis.captcha;
    const snapshot = await cache.snapshot<ICaptchaImageTextState>(token);
    if (!snapshot || !token.startsWith('imageText:') || !snapshot.data.token) return false;
    const data = snapshot.data;
    if (!this._matches(data.token!, tokenInput)) {
      await cache.compareAndSet(token, snapshot, { ...data, token: undefined, revision: uuidv4() });
      return false;
    }
    const tokenSecondary = uuidv4();
    const changed = await cache.compareAndSet(
      token,
      snapshot,
      { ...data, token: undefined, token2: tokenSecondary, revision: uuidv4() },
      data.ttlSecondary,
    );
    return changed ? tokenSecondary : false;
  }

  async updateToken(
    token: string,
    tokenInput: unknown,
    options: ICaptchaProviderOptionsImageText,
  ): Promise<TypeCaptchaProviderImageTextData> {
    const cache = this.$scope.captcha.cacheRedis.captcha;
    const snapshot = await cache.snapshot<ICaptchaImageTextState>(token);
    if (!snapshot || !token.startsWith('imageText:') || typeof tokenInput !== 'string') {
      return this.app.throw(403);
    }
    const { ttl, ttlSecondary } = this._policy(options);
    const written = await cache.writeProof(
      token,
      { token: tokenInput, revision: uuidv4(), ttlSecondary },
      ttl,
      snapshot,
    );
    if (!written.changed) return this.app.throw(403);
    return {
      token,
      tokenPublic: tokenInput,
      payload: '',
      serverNow: written.serverNow,
      expiresAt: written.expiresAt,
      routingExpiresAt: written.expiresAt + ttlSecondary,
    };
  }

  private _matches(token: string, input: unknown) {
    return typeof input === 'string' && !!input && input.toLowerCase() === token.toLowerCase();
  }

  private _policy(options: ICaptchaProviderOptionsImageText) {
    const defaults = this.$scope.captcha.config.captchaProvider;
    const ttl = options.ttl ?? defaults.ttl;
    const ttlSecondary = options.ttlSecondary ?? defaults.ttlSecondary;
    if (
      !Number.isSafeInteger(ttl) ||
      ttl <= 0 ||
      !Number.isSafeInteger(ttlSecondary) ||
      ttlSecondary <= 0 ||
      !Number.isSafeInteger(Date.now() + ttl + ttlSecondary)
    ) {
      throw new Error('invalid captcha ttl');
    }
    return { ttl, ttlSecondary };
  }

  private async _confirmFont(options: ICaptchaProviderOptionsImageText) {
    if (cast(svgCaptcha.options).font) return;
    const fontFile = options.fontPath || this.scope.asset.get('fonts', 'Comismsh.ttf');
    const font = await _loadFont(fontFile);
    cast(svgCaptcha.options).font = font;
    cast(svgCaptcha.options).ascender = font.ascender;
    cast(svgCaptcha.options).descender = font.descender;
  }
}

async function _loadFont(fontFile: string) {
  const buffer = await fse.readFile(fontFile);
  return opentypeParse(_nodeBufferToArrayBuffer(buffer));
}

function _nodeBufferToArrayBuffer(buffer) {
  const ab = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }

  return ab;
}
