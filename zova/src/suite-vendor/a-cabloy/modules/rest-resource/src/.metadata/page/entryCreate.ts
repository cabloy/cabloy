import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageEntryCreate } from '../../page/entryCreate/controller.jsx';
import { ControllerPageEntryCreateSchemaParams } from '../../page/entryCreate/controller.jsx';
export namespace NSControllerPageEntryCreate {
  export const paramsSchema = ControllerPageEntryCreateSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageEntryCreateSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageEntryCreateSchemaParams>;
}

export const ZPageEntryCreate = createZovaComponentPage(
  ControllerPageEntryCreate,
  undefined,
  undefined,
);
