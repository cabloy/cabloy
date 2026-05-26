import parser from 'co-body';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { BodyParserOptions, BodyType } from '../types/bodyParser.ts';

import { getIsEnabledBodyAs, getMimeTypes, isTypes } from '../lib/utils.ts';

@Bean()
export class BeanBodyReq extends BeanBase {
  async parse(options?: BodyParserOptions) {
    if (!options) {
      options = this.bean.onion.interceptor.getOnionOptionsDynamic('a-body:bodyReq').parser;
    }
    const ctx = this.ctx;
    if (Object.prototype.hasOwnProperty.call(ctx.request, 'body')) return ctx.request.body;
    if (!options.parsedMethods.includes(ctx.method.toUpperCase())) return;
    // parse
    const response = await this.parseRaw(options);
    // patch koa
    ctx.request.body = 'parsed' in response ? response.parsed : {};
    if (ctx.request.rawBody === undefined) ctx.request.rawBody = response.raw;
    return ctx.request.body;
  }

  async parseRaw(options: BodyParserOptions) {
    const ctx = this.ctx;
    const isEnabledBodyAs = getIsEnabledBodyAs(options.enableTypes);
    const mimeTypes = getMimeTypes(options.extendTypes);

    const shouldParseBodyAs = (type: BodyType) => {
      return Boolean(
        isEnabledBodyAs[type] && isTypes(ctx.request.get('content-type'), mimeTypes[type]),
      );
    };

    const bodyType =
      options.detectJSON?.(ctx) || shouldParseBodyAs('json')
        ? 'json'
        : shouldParseBodyAs('form')
          ? 'form'
          : shouldParseBodyAs('text') || shouldParseBodyAs('xml')
            ? 'text'
            : null;

    if (!bodyType) return {} as Record<string, string>;
    const parserOptions = {
      // force co-body return raw body
      returnRawBody: true,
      strict: bodyType === 'json' ? options.jsonStrict : undefined,
      [`${bodyType}Types`]: mimeTypes[bodyType],
      limit: options[`${shouldParseBodyAs('xml') ? 'xml' : bodyType}Limit`],
      encoding: options.encoding || 'utf-8',
    };

    return await parser[bodyType](ctx.req, parserOptions);
  }
}
