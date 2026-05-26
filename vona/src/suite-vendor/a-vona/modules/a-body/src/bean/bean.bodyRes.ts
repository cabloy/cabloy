import type {
  IOpenapiOptions,
  IResponseHeaders,
  TypeResponseContentType,
} from 'vona-module-a-openapiutils';
import type z from 'zod';

import { appMetadata, BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { $schema } from 'vona-module-a-openapiutils';
import { SymbolOpenApiOptions } from 'vona-module-a-openapiutils';

@Bean()
export class BeanBodyRes extends BeanBase {
  async setHeaders() {
    const headers = this.getResponseHeaders();
    if (!headers) return;
    this.ctx.set(headers);
  }

  async respond(body: any, contentType?: TypeResponseContentType, httpCode?: number) {
    if (!httpCode) httpCode = this.getResponseHttpCode(200);
    if (!contentType) contentType = this.getResponseContentType();
    if (contentType === 'application/json') {
      this.app.success(body ?? null);
      this.ctx.response.status = httpCode;
    } else {
      this.ctx.response.status = httpCode;
      this.ctx.response.type = contentType;
      this.ctx.response.body = body;
    }
  }

  getResponseHeaders(): IResponseHeaders | undefined {
    const controller = this.ctx.getController();
    if (controller) {
      const handlerName = this.ctx.getHandlerName();
      const options = appMetadata.getMetadata<IOpenapiOptions>(
        SymbolOpenApiOptions,
        controller.prototype,
        handlerName,
      );
      return options?.setHeaders;
    }
  }

  get handled() {
    return this.ctx.response.status !== 404 || this.ctx.response.body !== undefined;
  }

  getResponseHttpCode(defaultCode: number = 200): number {
    if (this.ctx.response.status !== 404) return this.ctx.response.status;
    let httpCode: number | undefined;
    const controller = this.ctx.getController();
    if (controller) {
      const handlerName = this.ctx.getHandlerName();
      const options = appMetadata.getMetadata<IOpenapiOptions>(
        SymbolOpenApiOptions,
        controller.prototype,
        handlerName,
      );
      httpCode = options?.httpCode;
    }
    return httpCode ?? defaultCode;
  }

  getResponseContentType(): TypeResponseContentType {
    if (this.ctx.response.type) return this.ctx.response.type as TypeResponseContentType;
    const controller = this.ctx.getController();
    if (controller) {
      const handlerName = this.ctx.getHandlerName();
      const options = appMetadata.getMetadata<IOpenapiOptions>(
        SymbolOpenApiOptions,
        controller.prototype,
        handlerName,
      );
      const contentType = options?.contentType;
      if (contentType) return contentType;
    }
    if (this.ctx.acceptJSON) return 'application/json';
    if (this.ctx.accepts('html') === 'html') return 'text/html';
    return 'application/octet-stream';
  }

  getResponseBodySchema(): z.ZodType | undefined {
    const controller = this.ctx.getController();
    if (!controller) return;
    const handlerName = this.ctx.getHandlerName();
    const options = appMetadata.getMetadata<IOpenapiOptions>(
      SymbolOpenApiOptions,
      controller.prototype,
      handlerName,
    );
    if (options?.bodySchema) return options.bodySchema;
    const metaType = appMetadata.getDesignReturntype(controller.prototype, handlerName);
    if (!metaType) return;
    return $schema(metaType as any);
  }
}
