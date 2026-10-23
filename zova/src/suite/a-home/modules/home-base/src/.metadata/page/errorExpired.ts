import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageErrorExpired } from '../../page/errorExpired/controller.tsx';
import { ControllerPageErrorExpiredSchemaQuery } from '../../page/errorExpired/controller.tsx';
export namespace NSControllerPageErrorExpired {
  export const querySchema = ControllerPageErrorExpiredSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageErrorExpiredSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageErrorExpiredSchemaQuery>;
}

export const ZPageErrorExpired = createZovaComponentPage(
  ControllerPageErrorExpired,
  undefined,
  undefined,
);
