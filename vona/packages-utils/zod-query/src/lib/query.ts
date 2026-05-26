import { z } from 'zod';

import { Metadata } from './metadata.ts';
import { isNil } from './utils.ts';
import { isZodType } from './zod-is-type.ts';

interface IParsePayload {
  value: any;
  issues: any[];
}

let ZodMetadata: any;
export function setParseAdapter(zodMetadata: any) {
  ZodMetadata = zodMetadata;
  (z.core as any).setParseAdapter(__parseAdapter);
}

function __parseAdapter(inst: z.ZodType, parse) {
  return (payload: IParsePayload, _) => {
    const type = inst.type;
    switch (type) {
      case 'string':
        return __parseString(inst, parse, payload, _);
      case 'number':
        return __parseNumber(inst, parse, payload, _);
      case 'bigint':
        return __parseBigInt(inst, parse, payload, _);
      case 'boolean':
        return __parseBoolean(inst, parse, payload, _);
      case 'date':
        return __parseDate(inst, parse, payload, _);
      case 'object':
        return __parseObject(inst, parse, payload, _);
      case 'array':
        return __parseArray(inst, parse, payload, _);
      case 'optional':
        return __parseOptional(inst, parse, payload, _);
      case 'default':
        return __parseDefault(inst, parse, payload, _);
    }
    return parse(payload, _);
  };
}

/////////////////////////////////////////
/////////////////////////////////////////
/// ///////                     /////////
/// ///////      ZodString      /////////
/// ///////                     /////////
/////////////////////////////////////////
/////////////////////////////////////////

function __parseString(inst, parse, payload: IParsePayload, _) {
  const metadata = ZodMetadata?.getOpenapiMetadata(inst);
  if (metadata?.format === 'binary' && !isNil(payload.value)) {
    // ignore upload file
    return payload;
  }
  _coerceString(payload);
  return parse(payload, _);
}

/////////////////////////////////////////
/////////////////////////////////////////
/// ///////                     /////////
/// ///////      ZodNumber      /////////
/// ///////                     /////////
/////////////////////////////////////////
/////////////////////////////////////////

function __parseNumber(_inst, parse, payload: IParsePayload, _) {
  _coerceWithNil(payload, () => {
    payload.value = Number(payload.value);
  });
  return parse(payload, _);
}

/////////////////////////////////////////
/////////////////////////////////////////
/// ///////                     /////////
/// ///////      ZodBigInt      /////////
/// ///////                     /////////
/////////////////////////////////////////
/////////////////////////////////////////

function __parseBigInt(_inst, parse, payload: IParsePayload, _) {
  _coerceWithNil(payload, () => {
    payload.value = BigInt(payload.value);
  });
  return parse(payload, _);
}

//////////////////////////////////////////
//////////////////////////////////////////
/// ///////                     //////////
/// ///////      ZodBoolean      /////////
/// ///////                     //////////
//////////////////////////////////////////
//////////////////////////////////////////

function __parseBoolean(_inst, parse, payload: IParsePayload, _) {
  _coerceWithNil(payload, () => {
    if (payload.value === 'false' || payload.value === '0') {
      payload.value = false;
    } else {
      payload.value = Boolean(payload.value);
    }
  });
  return parse(payload, _);
}

///////////////////////////////////////
///////////////////////////////////////
/// ///////                     ///////
/// ///////      ZodDate        ///////
/// ///////                     ///////
///////////////////////////////////////
///////////////////////////////////////

function __parseDate(_inst, parse, payload: IParsePayload, _) {
  _coerceWithNil(payload, () => {
    payload.value = new Date(payload.value);
  });
  return parse(payload, _);
}

/////////////////////////////////////////
/////////////////////////////////////////
/// ///////                     /////////
/// ///////      ZodObject      /////////
/// ///////                     /////////
/////////////////////////////////////////
/////////////////////////////////////////

function __parseObject(_inst, parse, payload: IParsePayload, _) {
  _coerceWithNil(payload, () => {
    if (typeof payload.value === 'string') {
      payload.value = JSON.parse(payload.value);
    }
  });
  return parse(payload, _);
}

////////////////////////////////////////
////////////////////////////////////////
/// ///////                    /////////
/// ///////      ZodArray      /////////
/// ///////                    /////////
////////////////////////////////////////
////////////////////////////////////////

function __parseArray(_inst, parse, payload: IParsePayload, _) {
  _coerceWithNil(payload, () => {
    if (typeof payload.value === 'string') {
      if (payload.value.startsWith('[') && payload.value.endsWith(']')) {
        payload.value = JSON.parse(payload.value);
      } else {
        payload.value = payload.value.split(',');
      }
    }
  });
  return parse(payload, _);
}

///////////////////////////////////////////
///////////////////////////////////////////
/// ///////                       /////////
/// ///////      ZodOptional      /////////
/// ///////                       /////////
///////////////////////////////////////////
///////////////////////////////////////////

function __parseOptional(_inst, parse, payload: IParsePayload, _) {
  if (isZodType(Metadata.unwrapUntil(_inst), 'ZodString')) {
    _coerceString(payload);
  } else {
    _coerceWithNil(payload);
  }
  if (payload.value === null) {
    payload.value = undefined;
  }
  return parse(payload, _);
}

////////////////////////////////////////////
////////////////////////////////////////////
/// ///////                        /////////
/// ///////       ZodDefault       /////////
/// ///////                        /////////
////////////////////////////////////////////
////////////////////////////////////////////

function __parseDefault(_inst, parse, payload: IParsePayload, _) {
  if (isZodType(Metadata.unwrapUntil(_inst), 'ZodString')) {
    _coerceString(payload);
  } else {
    _coerceWithNil(payload);
  }
  return parse(payload, _);
}

///////////////////////////////////////
///////////////////////////////////////
/// ///////                     ///////
/// ///////      coerce         ///////
/// ///////                     ///////
///////////////////////////////////////
///////////////////////////////////////

// function _coerce(payload: IParsePayload, fn?: Function) {
//   if (!isNil(payload.value)) {
//     fn?.(payload);
//   }
// }

function _coerceString(payload: IParsePayload, fn?: Function) {
  if (!isNil(payload.value)) {
    if (payload.value === '') {
      payload.value = undefined;
    } else if (typeof payload.value !== 'string') {
      payload.value = String(payload.value);
    } else {
      fn?.(payload);
    }
  }
}

function _coerceWithNil(payload: IParsePayload, fn?: Function) {
  if (!isNil(payload.value)) {
    if (payload.value === 'undefined' || payload.value === '') {
      payload.value = undefined;
    } else if (payload.value === 'null') {
      payload.value = null;
    } else {
      fn?.(payload);
    }
  }
}

export function coerceWithNil(value: any, fn?: Function) {
  const payload = { value, issues: [] };
  _coerceWithNil(payload, fn);
  return payload.value;
}

export function getInnerTypeName(schema: z.ZodType) {
  return Metadata.unwrapUntil(schema).type;
}
// function _coerce(instance, input, fn) {
//   if (instance._def.coerce !== false) {
//     if (instance._def.coerce === true) instance._def.coerce = undefined as any;
//     if (!isNil(payload.value)) {
//       fn();
//     }
//   }
// }
