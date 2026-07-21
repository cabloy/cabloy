import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageCart } from '../../page/cart/controller.jsx';
import {
  ControllerPageCartSchemaParams,
  ControllerPageCartSchemaQuery,
} from '../../page/cart/controller.jsx';
export namespace NSControllerPageCart {
  export const paramsSchema = ControllerPageCartSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageCartSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageCartSchemaParams>;

  export const querySchema = ControllerPageCartSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageCartSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageCartSchemaQuery>;
}

export const ZPageCart = createZovaComponentPage(ControllerPageCart, undefined, undefined);
