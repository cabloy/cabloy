import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageEntry } from '../../page/entry/controller.tsx';
import { ControllerPageEntrySchemaParams } from '../../page/entry/controller.tsx';
export namespace NSControllerPageEntry {
  export const paramsSchema = ControllerPageEntrySchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageEntrySchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageEntrySchemaParams>;
}

export const ZPageEntry = createZovaComponentPage(ControllerPageEntry, undefined, undefined);
