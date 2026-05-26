import typeis from 'type-is';
import { deepExtend } from 'vona';

import type { BodyParserOptions, BodyType } from '../types/bodyParser.ts';

import { supportedBodyTypes } from '../types/bodyParser.ts';

export class UnsupportedBodyTypeError extends Error {
  constructor(wrongType: string) {
    super();
    this.name = 'UnsupportedBodyTypeError';
    this.message =
      `Invalid enabled type '${wrongType}'.` +
      ' make sure to pass an array contains ' +
      `supported types ([${supportedBodyTypes}]).`;
  }
}

export function getIsEnabledBodyAs(enableTypes: BodyType[]) {
  for (const enabledType of enableTypes) {
    if (!supportedBodyTypes.includes(enabledType)) {
      throw new UnsupportedBodyTypeError(enabledType);
    }
  }

  const isEnabledBodyAs = supportedBodyTypes.reduce(
    (prevResult, currentType) => ({
      ...prevResult,
      [currentType]: enableTypes.includes(currentType),
    }),
    {} as NonNullable<BodyParserOptions['extendTypes']>,
  );

  return isEnabledBodyAs;
}

export function getMimeTypes(extendTypes: NonNullable<BodyParserOptions['extendTypes']>) {
  for (const extendedTypeKey of Object.keys(extendTypes) as BodyType[]) {
    const extendedType = extendTypes[extendedTypeKey];

    if (!supportedBodyTypes.includes(extendedTypeKey) || !Array.isArray(extendedType)) {
      throw new UnsupportedBodyTypeError(extendedTypeKey);
    }
  }

  const defaultMimeTypes = {
    json: [
      'application/json',
      'application/json-patch+json',
      'application/vnd.api+json',
      'application/csp-report',
      'application/reports+json',
      'application/scim+json',
    ],
    form: ['application/x-www-form-urlencoded'],
    text: ['text/plain'],
    xml: ['text/xml', 'application/xml'],
  };
  const mimeTypes = deepExtend(defaultMimeTypes, extendTypes);
  return mimeTypes;
}

/**
 * Check if the incoming request contains the "Content-Type" header
 * field, and it contains any of the give mime types. If there
 * is no request body, null is returned. If there is no content type,
 * false is returned. Otherwise, it returns the first type that matches.
 */
export function isTypes(contentTypeValue: string, types: string[]) {
  if (typeof contentTypeValue === 'string') {
    // trim extra semicolon
    contentTypeValue = contentTypeValue.replace(/;$/, '');
  }

  return typeis.is(contentTypeValue, types);
}
