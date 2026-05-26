import type { ILocaleMagic } from 'vona';

import { useApp } from 'vona';
import { z } from 'zod';

import { normalizeErrorParams } from '../../utils.ts';

export function schemaEmail(params?: string | ILocaleMagic | z.core.$ZodEmailParams) {
  return function (_schema: z.ZodString): z.ZodEmail {
    return z.email(normalizeErrorParams(params));
  };
}

export function schemaUrl(params?: string | ILocaleMagic | z.core.$ZodURLParams) {
  return function (_schema: z.ZodString): z.ZodURL {
    return z.url(normalizeErrorParams(params));
  };
}

export function schemaUuid(params?: string | ILocaleMagic | z.core.$ZodUUIDParams) {
  return function (_schema: z.ZodString): z.ZodUUID {
    return z.uuid(normalizeErrorParams(params));
  };
}

export function schemaIPv4(params?: string | ILocaleMagic | z.core.$ZodIPv4Params) {
  return function (_schema: z.ZodString): z.ZodIPv4 {
    return z.ipv4(normalizeErrorParams(params));
  };
}

export function schemaIPv6(params?: string | ILocaleMagic | z.core.$ZodIPv6Params) {
  return function (_schema: z.ZodString): z.ZodIPv6 {
    return z.ipv6(normalizeErrorParams(params));
  };
}

export function schemaMin(
  min: number,
  params?:
    | string
    | ILocaleMagic
    | z.core.$ZodCheckMinLengthParams
    | z.core.$ZodCheckGreaterThanParams,
) {
  return function (schema: z.ZodString | z.ZodNumber): z.ZodString | z.ZodNumber {
    if (schema.type === 'string') {
      return schema.min(
        min,
        normalizeErrorParams(params) as string | z.core.$ZodCheckMinLengthParams,
      );
    } else {
      return schema.min(
        min,
        normalizeErrorParams(params) as string | z.core.$ZodCheckGreaterThanParams,
      );
    }
  };
}

export function schemaMax(
  max: number,
  params?: string | ILocaleMagic | z.core.$ZodCheckMaxLengthParams | z.core.$ZodCheckLessThanParams,
) {
  return function (schema: z.ZodString | z.ZodNumber): z.ZodString | z.ZodNumber {
    if (schema.type === 'string') {
      return schema.max(
        max,
        normalizeErrorParams(params) as string | z.core.$ZodCheckMaxLengthParams,
      );
    } else {
      return schema.max(
        max,
        normalizeErrorParams(params) as string | z.core.$ZodCheckLessThanParams,
      );
    }
  };
}

export function schemaTrim() {
  return function (schema: z.ZodString): z.ZodString {
    return schema.trim();
  };
}

export function schemaToLowerCase() {
  return function (schema: z.ZodString): z.ZodString {
    return schema.toLowerCase();
  };
}

export function schemaToUpperCase() {
  return function (schema: z.ZodString): z.ZodString {
    return schema.toUpperCase();
  };
}

export function schemaLowercase(params?: string | ILocaleMagic | z.core.$ZodCheckLowerCaseParams) {
  return function (schema: z.ZodString): z.ZodString {
    return schema.lowercase(normalizeErrorParams(params));
  };
}

export function schemaUppercase(params?: string | ILocaleMagic | z.core.$ZodCheckUpperCaseParams) {
  return function (schema: z.ZodString): z.ZodString {
    return schema.uppercase(normalizeErrorParams(params));
  };
}

export function schemaRegex(
  regex: RegExp,
  params?: string | ILocaleMagic | z.core.$ZodCheckRegexParams,
) {
  return function (schema: z.ZodString): z.ZodString {
    return schema.regex(regex, normalizeErrorParams(params));
  };
}

export function schemaTableIdentity() {
  return function (_schema?: any): z.ZodType {
    const schema = z.union([z.number(), z.string()]);
    return schema.transform(value => {
      const app = useApp();
      const ormConfig = app.util.getModuleConfigRaw('a-orm');
      const _identityType = ormConfig?.table?.identityType ?? 'bigint';
      if (_identityType === 'number') {
        return Number.parseInt(value as any);
      } else if (_identityType === 'bigint') {
        return String(value);
      } else {
        throw new Error('not support');
      }
    });
  };
}
