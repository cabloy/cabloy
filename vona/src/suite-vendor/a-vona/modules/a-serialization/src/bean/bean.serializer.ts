import type { ISchemaObjectExtensionField } from 'vona-module-a-openapi';
import type z from 'zod';

import { isEmptyObject } from '@cabloy/utils';
import { ZodMetadata } from '@cabloy/zod-openapi';
import { BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type {
  ISerializerTransform,
  ISerializerTransformRecord,
} from '../types/serializerTransform.ts';

@Bean()
export class BeanSerializer extends BeanBase {
  public async transform(data: any, schema: z.ZodType | undefined) {
    // only support array/object
    if (!data || typeof data !== 'object' || !schema) return data;
    // schema
    const innerSchema = ZodMetadata.unwrapChained(ZodMetadata.resolveLazySchema(schema));
    // array
    if (Array.isArray(data) && innerSchema.type === 'array') {
      return await this._transformArray(data, innerSchema as z.ZodArray);
    }
    // object
    if (!Array.isArray(data) && innerSchema.type === 'object') {
      return await this._transformObject(data, innerSchema as z.ZodObject);
    }
    // others
    return data;
  }

  private async _transformArray(data: object[], schema: z.ZodArray) {
    const res: any[] = [];
    for (const item of data) {
      res.push(await this.transform(item, schema.def.element as any));
    }
    return res;
  }

  private async _transformObject(data: object, schema: z.ZodObject) {
    const dataPatch = {};
    for (const key in schema.shape) {
      const keySchema = ZodMetadata.resolveLazySchema(schema.shape[key]);
      const metadata: ISchemaObjectExtensionField | undefined = ZodMetadata.getOpenapiMetadata(
        keySchema,
      ) as ISchemaObjectExtensionField | undefined;
      if (!metadata) continue;
      // valuePatch
      let valuePatch = data[key];
      // inner
      valuePatch = await this.transform(valuePatch, keySchema);
      // serializerTransforms
      if (metadata.serializerTransforms) {
        // loop
        for (const transformName in metadata.serializerTransforms) {
          const transformOptions = metadata.serializerTransforms[transformName];
          const options = this.bean.onion.serializerTransform.getOnionOptionsDynamic(
            transformName as keyof ISerializerTransformRecord,
            transformOptions,
          );
          // filter
          if (options.filter) {
            const resFilter = await options.filter.call(this.ctx, valuePatch, data, options);
            if (!resFilter) continue;
          }
          // execute
          const beanFullName = beanFullNameFromOnionName(transformName, 'serializerTransform');
          const beanInstance = this.bean._getBean(beanFullName) as ISerializerTransform;
          if (!beanInstance) {
            throw new Error(`serializerTransform bean not found: ${beanFullName}`);
          }
          valuePatch = await beanInstance.transform(valuePatch, data, options);
        }
      }
      // patch
      if (valuePatch !== data[key]) {
        dataPatch[key] = valuePatch;
      }
    }
    if (!isEmptyObject(dataPatch)) {
      data = { ...data, ...dataPatch };
    }
    return data;
  }
}
