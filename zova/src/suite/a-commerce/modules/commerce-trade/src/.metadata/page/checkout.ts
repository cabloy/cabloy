import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageCheckout } from '../../page/checkout/controller.tsx';
import {
  ControllerPageCheckoutSchemaParams,
  ControllerPageCheckoutSchemaQuery,
} from '../../page/checkout/controller.tsx';
export namespace NSControllerPageCheckout {
  export const paramsSchema = ControllerPageCheckoutSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPageCheckoutSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPageCheckoutSchemaParams>;

  export const querySchema = ControllerPageCheckoutSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageCheckoutSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageCheckoutSchemaQuery>;
}

export const ZPageCheckout = createZovaComponentPage(ControllerPageCheckout, undefined, undefined);
