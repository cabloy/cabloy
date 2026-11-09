import type { VonaApplication } from 'vona';

import { ZodMetadata } from '@cabloy/zod-openapi';
import { OpenApiGeneratorV31, OpenAPIRegistry } from '@cabloy/zod-to-openapi';
import { cast } from 'vona';

export function schemaRefCustomAdapter(_app: VonaApplication) {
  const registry = new OpenAPIRegistry();
  const generator31 = new OpenApiGeneratorV31(registry.definitions);
  _patchGenerator(generator31);
}

function _patchGenerator(generator: any) {
  const gen = Object.getPrototypeOf(cast(generator).generator);
  gen.generateSchemaWithRef = function (zodSchema) {
    // Resolving a lazy schema preserves public metadata but not its internal
    // refId. Keep the lazy anchor's name so recursive children reuse the
    // in-progress reference instead of expanding the same union indefinitely.
    let refId = ZodMetadata.getRefId(zodSchema);
    zodSchema = ZodMetadata.resolveLazySchema(zodSchema);
    refId ??= ZodMetadata.getRefId(zodSchema);
    if (!refId) {
      return this.generateSimpleSchema(zodSchema);
    }
    if (this.schemaRefs[refId] === undefined) {
      this.schemaRefs[refId] = null;
      const result = this.generateSimpleSchema(zodSchema);
      this.schemaRefs[refId] = result;
    }
    return { $ref: this.generateSchemaRef(refId) };
  };
}
