import type { RouteHandlerArgumentMetaDecorator } from 'vona-module-a-openapi';

import { ZodMetadata } from '@cabloy/zod-openapi';
import { appMetadata, BeanBase, deepExtend } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { SymbolRouteHandlersArgumentsMeta } from 'vona-module-a-openapiutils';
import { recordResourceNameToRoutePath } from 'vona-module-a-web';

import type {
  IImageUploadPolicyResolved,
  IImageUploadTokenPayload,
  TypeImageUploadFormScene,
} from '../types/image.ts';

const __ApiPathImageUpload = '/api/a-image/image/upload';

@Bean()
export class BeanImageUploadPolicy extends BeanBase {
  async createUploadToken(data: {
    resource: string;
    field: string;
    formScene?: TypeImageUploadFormScene;
    size: number;
    mimeType: string;
  }) {
    const imageConfig = (this.scope as any).config.image as any;
    const payload = await this.resolveUploadPolicy(data);
    const tokenExpiresIn = imageConfig.upload.tokenExpiresIn;
    const token = await this.bean.jwt.createTempAuthToken(
      {
        kind: 'imageUpload',
        expiresIn: tokenExpiresIn,
        issuedAt: Date.now(),
        ...payload,
      } as IImageUploadTokenPayload,
      {
        path: __ApiPathImageUpload,
      },
    );
    return {
      token,
      expiresIn: tokenExpiresIn,
    };
  }

  async verifyUploadToken(token?: string) {
    const payload = (await this.bean.jwt.get('access').verify(token, {
      path: __ApiPathImageUpload,
    })) as IImageUploadTokenPayload | undefined;
    if (!payload || payload.kind !== 'imageUpload') {
      return this.app.throw(401);
    }
    if (Date.now() > payload.issuedAt + payload.expiresIn * 1000) {
      return this.app.throw(401);
    }
    return payload;
  }

  async resolveUploadPolicy(data: {
    resource: string;
    field: string;
    formScene?: TypeImageUploadFormScene;
    size: number;
    mimeType: string;
  }): Promise<IImageUploadPolicyResolved> {
    const formScene = data.formScene ?? 'create';
    const imageConfig = (this.scope as any).config.image as any;
    const bodySchema = this._getResourceBodySchema(data.resource, formScene);
    const fieldSchema = ZodMetadata.getFieldSchema(bodySchema, data.field);
    if (!fieldSchema) {
      throw new Error(`field not found: ${data.resource}.${data.field}`);
    }
    const fieldOpenapi = ZodMetadata.getOpenapiMetadata(fieldSchema) as any;
    const rest = this._resolveRestField(fieldOpenapi?.rest, formScene);
    if (rest?.render !== 'basic-image:formFieldImage') {
      throw new Error(`field is not basic-image:formFieldImage: ${data.resource}.${data.field}`);
    }
    const options = rest?.options ?? {};
    const uploadOptions = options.upload ?? {};
    const { mimeTypes, extensions } = this._resolveAcceptedTypes(options, uploadOptions);
    const maxSize = uploadOptions.maxSize ?? options.maxSize ?? imageConfig.upload.maxSize;
    const mimeType = data.mimeType.toLowerCase();
    if (maxSize && data.size > maxSize) {
      return this.app.throw(403, `image too large: maxSize=${maxSize}`);
    }
    if (mimeTypes.length > 0 && !this._matchesMimeType(mimeType, mimeTypes)) {
      return this.app.throw(403, `unsupported image mimeType: ${mimeType}`);
    }
    return {
      resource: data.resource,
      field: data.field,
      formScene,
      providerName:
        uploadOptions.providerName ??
        uploadOptions.provider ??
        options.providerName ??
        options.provider ??
        imageConfig.defaultProvider,
      clientName: uploadOptions.clientName ?? options.clientName ?? imageConfig.defaultClientName,
      maxSize,
      mimeTypes: mimeTypes.length > 0 ? mimeTypes : [...(imageConfig.upload.mimeTypes ?? [])],
      extensions,
      multiple: !!options.multiple,
      fileSize: data.size,
      mimeType: data.mimeType.toLowerCase(),
    };
  }

  private _getResourceBodySchema(resource: string, formScene: TypeImageUploadFormScene) {
    const routePathInfo = recordResourceNameToRoutePath[resource as never] as any;
    if (!routePathInfo) {
      throw new Error(`not found routePath of resource: ${resource}`);
    }
    const actionKey = formScene === 'edit' ? 'update' : 'create';
    const argsMeta = appMetadata.getMetadata<RouteHandlerArgumentMetaDecorator[]>(
      SymbolRouteHandlersArgumentsMeta,
      routePathInfo.controller.prototype,
      actionKey,
    );
    const bodyArg = argsMeta?.find(item => item?.type === 'body' && !item.field);
    if (!bodyArg?.schema) {
      throw new Error(`body schema not found: ${resource}.${actionKey}`);
    }
    return bodyArg.schema;
  }

  private _resolveRestField(rest: any, formScene: TypeImageUploadFormScene) {
    return deepExtend(
      {},
      rest ?? {},
      rest?.form ?? {},
      formScene === 'create' ? (rest?.['form-create'] ?? {}) : {},
    );
  }

  private _matchesMimeType(mimeType: string, mimeTypes: string[]) {
    return mimeTypes.some(item => {
      if (item === mimeType) return true;
      if (item.endsWith('/*')) {
        return mimeType.startsWith(`${item.slice(0, -1)}`);
      }
      return false;
    });
  }

  private _resolveAcceptedTypes(options: any, uploadOptions: any) {
    const mimeTypes = new Set<string>([
      ...(options.mimeTypes ?? []),
      ...(uploadOptions.mimeTypes ?? []),
    ]);
    const extensions = new Set<string>([
      ...(options.extensions ?? []),
      ...(uploadOptions.extensions ?? []),
    ]);
    const accept = [options.accept, uploadOptions.accept]
      .flat()
      .filter(item => !!item)
      .flatMap(item => (Array.isArray(item) ? item : String(item).split(',')));
    for (const tokenRaw of accept) {
      const token = String(tokenRaw).trim().toLowerCase();
      if (!token) continue;
      if (token.startsWith('.')) {
        extensions.add(token);
      } else {
        mimeTypes.add(token);
      }
    }
    return {
      mimeTypes: Array.from(mimeTypes),
      extensions: Array.from(extensions),
    };
  }
}
