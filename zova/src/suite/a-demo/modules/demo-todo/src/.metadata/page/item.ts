import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageItem } from '../../page/item/controller.jsx';
import {
  ControllerPageItemSchemaParams,
  ControllerPageItemSchemaQuery,
} from '../../page/item/controller.jsx';
export namespace NSControllerPageItem {
  export const paramsSchema = ControllerPageItemSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageItemSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageItemSchemaParams>;

  export const querySchema = ControllerPageItemSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageItemSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageItemSchemaQuery>;
}

export const ZPageItem = createZovaComponentPage(ControllerPageItem, undefined, undefined);
