import type { Constructable } from 'vona';

import { isNil } from '@cabloy/utils';
import { coerceWithNil } from '@cabloy/zod-query';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { $schema } from 'vona-module-a-openapiutils';
import { z } from 'zod';

import type { ValidatorOptions } from '../types/validatorOptions.ts';

@Bean()
export class BeanValidator extends BeanBase {
  async validate<T, V = T>(
    classType: Constructable<T>,
    value: V,
    options?: Partial<ValidatorOptions>,
    path?: string,
  ): Promise<V extends undefined ? undefined : V extends null ? null : T> {
    // const errorHttpStatusCode = options?.errorHttpStatusCode ?? HttpStatus.BAD_REQUEST;
    // check value: nil, maybe need other argument derecotor to validate it
    value = coerceWithNil(value);
    if (isNil(value)) return value as any;
    // // need not check value: primitive
    // if (this._isPrimitiveValue(value)) {
    //   this.app.throw(errorHttpStatusCode, this.scope.locale.ValidationFailedPipeValidationInvalidContent());
    // }
    // schema
    const schema = $schema(classType, options);
    return await this.validateSchema(schema, value, options, path);
  }

  async validateSchema<T, V = T>(
    schema: z.ZodType<T> | undefined,
    value: V,
    options?: Partial<ValidatorOptions>,
    path?: string,
  ): Promise<V extends undefined ? undefined : V extends null ? null : T> {
    // no path
    if (!path) {
      return await this._validateSchema(schema, value, options);
    }
    // path
    const schema2 = z.object({ [path]: schema } as z.ZodRawShape);
    const obj = { [path]: value };
    const data = await this._validateSchema(schema2, obj, options);
    return data[path] as any;
  }

  private async _validateSchema<T, V = T>(
    schema: z.ZodType<T> | undefined,
    value: V,
    options?: Partial<ValidatorOptions>,
  ): Promise<V extends undefined ? undefined : V extends null ? null : T> {
    const errorHttpStatusCode = options?.errorHttpStatusCode ?? 400;
    if (!schema) return value as any;
    const result = await schema?.safeParseAsync(value);
    if (result.success) return result.data as any;
    // error
    if (options?.disableErrorMessages) {
      this.app.throw(errorHttpStatusCode);
    }
    const issues = options?.exceptionFactory
      ? options.exceptionFactory(result.error)
      : result.error.issues;
    if (issues && typeof issues === 'object') {
      const app = this.app;
      issues.toString = function () {
        if (app.meta.isProd) {
          return JSON.stringify(this);
        } else {
          return JSON.stringify(this, null, 2);
        }
      };
    }
    return this.app.throw(422, issues);
  }

  // private _isPrimitiveValue(value: unknown): boolean {
  //   return ['number', 'boolean', 'string'].includes(typeof value);
  // }
}
