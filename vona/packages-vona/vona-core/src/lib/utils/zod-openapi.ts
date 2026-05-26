import { hashkey, isEmptyObject } from '@cabloy/utils';
import { ZodMetadata } from '@cabloy/zod-openapi';
import { extendZodWithOpenApi } from '@cabloy/zod-to-openapi';
import { z } from 'zod';

import { deepExtend } from './util.ts';

export function zodExtendOpenApi() {
  extendZodWithOpenApi(z);
  const openapiOriginal = z.ZodType.prototype.openapi;
  z.ZodType.prototype.openapi = function (this: z.ZodType, ...args) {
    // refId
    if (typeof args[0] === 'string') return openapiOriginal.call(this, ...args);
    // metadata/options
    const metadata = args[0];
    const options = args[1];
    // metadata
    if (isEmptyObject(metadata)) {
      return this;
      // return openapiOriginal.call(this, ...args);
    }
    const metadataOld = ZodMetadata.getOpenapiMetadata(this);
    const metadataNew = deepExtend({}, metadataOld, metadata);
    // refId
    const refId = ZodMetadata.getRefId(this);
    if (!refId) {
      return openapiOriginal.call(this, metadataNew, options);
    }
    // refId: update
    const refIdNew = `${refId}_${hashkey(metadata)}`;
    return openapiOriginal.call(this, refIdNew, metadataNew, options);
  };
}
