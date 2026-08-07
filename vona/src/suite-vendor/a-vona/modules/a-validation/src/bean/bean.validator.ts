import type { Constructable } from 'vona';
import type { ISchemaObjectExtensionFieldRest, TypeSchemaScene } from 'vona-module-a-openapi';

import { isNil } from '@cabloy/utils';
import { ZodMetadata } from '@cabloy/zod-openapi';
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
    if (result.success) return this._sanitizeReadonly(schema, result.data) as any;
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

  private _sanitizeReadonly(schema: z.ZodType, value: unknown, inheritedScene?: TypeSchemaScene) {
    if (value === null || typeof value !== 'object') return value;

    const schemaResolved = ZodMetadata.resolveLazySchema(schema);
    const schemaUnwrapped = ZodMetadata.unwrapChained(schemaResolved);
    const metadata = ZodMetadata.getOpenapiMetadata(schemaResolved) as
      | { rest?: ISchemaObjectExtensionFieldRest }
      | undefined;
    const scene = metadata?.rest?.schemaScene ?? inheritedScene;

    if (schemaUnwrapped.def.type === 'array' && Array.isArray(value)) {
      const element = (schemaUnwrapped as z.ZodArray).def.element as z.ZodType;
      return value.map(item => this._sanitizeReadonly(element, item, scene));
    }

    if (schemaUnwrapped.def.type !== 'object' || Array.isArray(value)) return value;

    const result: Record<string, unknown> = {};
    const shape = (schemaUnwrapped as z.ZodObject).shape;
    for (const key in value as Record<string, unknown>) {
      const keySchema = shape[key] as z.ZodType | undefined;
      if (!keySchema) {
        result[key] = (value as Record<string, unknown>)[key];
        continue;
      }
      const keyResolved = ZodMetadata.resolveLazySchema(keySchema);
      const keyMetadata = ZodMetadata.getOpenapiMetadata(keyResolved) as
        | { rest?: ISchemaObjectExtensionFieldRest }
        | undefined;
      const rest = this._resolveReadonlyRest(keyMetadata?.rest, scene);
      if (rest.readonly === true) continue;
      result[key] = this._sanitizeReadonly(
        keyResolved,
        (value as Record<string, unknown>)[key],
        scene,
      );
    }
    return result;
  }

  private _resolveReadonlyRest(
    rest: ISchemaObjectExtensionFieldRest | undefined,
    scene: TypeSchemaScene | undefined,
  ): ISchemaObjectExtensionFieldRest {
    if (!rest) return {};
    const result: ISchemaObjectExtensionFieldRest = { ...rest };
    const formRest = rest.form;
    if (scene && ['form-view', 'form-create', 'filter'].includes(scene) && formRest) {
      Object.assign(result, formRest);
    }
    if (scene) {
      const sceneRest = rest[scene];
      if (sceneRest) Object.assign(result, sceneRest);
    }
    return result;
  }

  // private _isPrimitiveValue(value: unknown): boolean {
  //   return ['number', 'boolean', 'string'].includes(typeof value);
  // }
}
