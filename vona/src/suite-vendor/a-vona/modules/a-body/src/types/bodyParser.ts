import type { Options as CoBodyOptions } from 'co-body';
import type { VonaContext } from 'vona';

declare module 'koa' {
  export interface Request {
    body: any;
    rawBody: string;
  }
}

export const supportedBodyTypes = ['json', 'form', 'text', 'xml'] as const;
export type BodyType = (typeof supportedBodyTypes)[number];

/**
 * BodyParser Options
 */
export type BodyParserOptions = {
  /**
   * declares the HTTP methods where bodies will be parsed.
   * @default ['POST', 'PUT', 'PATCH']
   */
  parsedMethods: string[];
  /**
   * json detector function, can help to detect request json type based on custom logic
   */
  detectJSON?: (ctx: VonaContext) => boolean;
  /**
   * co-body parser will only parse when request type hits enableTypes
   * @default ['json', 'form']
   */
  enableTypes: BodyType[];
  /**
   * extend parser types, can help to enhance the base mime types with custom types
   */
  extendTypes: {
    [K in BodyType]?: string[];
  };
  /**
   * When set to true, JSON parser will only accept arrays and objects.
   * When false will accept anything JSON.parse accepts.
   *
   * @default true
   */
  jsonStrict: CoBodyOptions['strict'];
  /**
   * limit of the `json` body
   * @default '1mb'
   */
  jsonLimit: CoBodyOptions['limit'];
  /**
   * limit of the `urlencoded` body
   * @default '56kb'
   */
  formLimit: CoBodyOptions['limit'];
  /**
   * limit of the `text` body
   * @default '1mb'
   */
  textLimit: CoBodyOptions['limit'];
  /**
   * limit of the `xml` body
   * @default '1mb'
   */
  xmlLimit: CoBodyOptions['limit'];
} & Pick<
  CoBodyOptions,
  /**
   * requested encoding.
   * @default 'utf-8' by 'co-body'.
   */
  'encoding'
>;
