import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPagePasswordReset } from '../../page/passwordReset/controller.tsx';
import { ControllerPagePasswordResetSchemaQuery } from '../../page/passwordReset/controller.tsx';
export namespace NSControllerPagePasswordReset {
  export const querySchema = ControllerPagePasswordResetSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPagePasswordResetSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPagePasswordResetSchemaQuery>;
}

export const ZPagePasswordReset = createZovaComponentPage(
  ControllerPagePasswordReset,
  undefined,
  undefined,
);
