import type { OpenAPIObjectConfig as OpenAPIObjectConfigV30 } from '@cabloy/zod-to-openapi/dist/v3.0/openapi-generator.ts';
import type { OpenAPIObjectConfigV31 } from '@cabloy/zod-to-openapi/dist/v3.1/openapi-generator.ts';
import type { VonaApplication } from 'vona';
import type { TypeOpenApiVersion, TypeSecuritySchemes } from 'vona-module-a-openapiutils';

export function config(_app: VonaApplication) {
  return {
    defaultVersion: 'V31' as TypeOpenApiVersion,
    generateDocument: {
      V30: {
        openapi: '3.0.0',
        info: {
          version: '5.0.0',
          title: 'Vona',
          description: 'Vona API',
        },
      } as OpenAPIObjectConfigV30,
      V31: {
        openapi: '3.1.0',
        info: {
          version: '5.0.0',
          title: 'Vona',
          description: 'Vona API',
        },
      } as OpenAPIObjectConfigV31,
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    } as TypeSecuritySchemes,
  };
}
