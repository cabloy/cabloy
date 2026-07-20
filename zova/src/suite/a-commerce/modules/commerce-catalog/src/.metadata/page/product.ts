import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageProduct } from '../../page/product/controller.jsx';
import {
  ControllerPageProductSchemaParams,
  ControllerPageProductSchemaQuery,
} from '../../page/product/controller.jsx';
export namespace NSControllerPageProduct {
  export const paramsSchema = ControllerPageProductSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageProductSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageProductSchemaParams>;

  export const querySchema = ControllerPageProductSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageProductSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageProductSchemaQuery>;
}

export const ZPageProduct = createZovaComponentPage(ControllerPageProduct, undefined, undefined);
