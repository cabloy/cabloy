import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPagePayment } from '../../page/payment/controller.tsx';
import {
  ControllerPagePaymentSchemaParams,
  ControllerPagePaymentSchemaQuery,
} from '../../page/payment/controller.tsx';
export namespace NSControllerPagePayment {
  export const paramsSchema = ControllerPagePaymentSchemaParams;
  export type ParamsInput = z.input<typeof ControllerPagePaymentSchemaParams>;
  export type ParamsOutput = z.output<typeof ControllerPagePaymentSchemaParams>;

  export const querySchema = ControllerPagePaymentSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPagePaymentSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPagePaymentSchemaQuery>;
}

export const ZPagePayment = createZovaComponentPage(ControllerPagePayment, undefined, undefined);
