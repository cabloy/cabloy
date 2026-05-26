import type { VonaApplication } from 'vona';

import { ExtendSchemaBuilder } from './schemaBuilder.ts';
import { ExtendTableBuilder } from './tableBuilder.ts';

export * from './schemaBuilder.ts';
export * from './tableBuilder.ts';

export function ExtendKnex(app: VonaApplication) {
  ExtendSchemaBuilder(app);
  ExtendTableBuilder(app);
}
