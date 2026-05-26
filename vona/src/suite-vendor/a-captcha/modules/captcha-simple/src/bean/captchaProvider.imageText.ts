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
import { BeanBase, cast } from 'vona';
import { CaptchaProvider } from 'vona-module-a-captcha';

export type TypeCaptchaProviderImageTextToken = string;
export type TypeCaptchaProviderImageTextPayload = string;
export type TypeCaptchaProviderImageTextData = ICaptchaProviderData<
  TypeCaptchaProviderImageTextToken,
  TypeCaptchaProviderImageTextPayload
>;

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
  ): Promise<TypeCaptchaProviderImageTextData> {
    await this._confirmFont(options);
    let type = options.type;
    if (!type) {
      type = CaptchaProviderImageTextTypes[getRandomInt(2, 0)];
    }
    const captcha =
      type === 'char' ? svgCaptcha.create(options.opts) : svgCaptcha.createMathExpr(options.opts);
    return { token: captcha.text, payload: svg64(captcha.data) };
  }

  async verify(
    token: TypeCaptchaProviderImageTextToken,
    tokenInput: TypeCaptchaProviderImageTextToken,
    _options: ICaptchaProviderOptionsImageText,
  ): Promise<boolean> {
    return !!tokenInput && !!token && tokenInput.toLowerCase() === token.toLowerCase();
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
