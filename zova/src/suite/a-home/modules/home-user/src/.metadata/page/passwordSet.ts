import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPagePasswordSet } from '../../page/passwordSet/controller.tsx';
import { ControllerPagePasswordSetSchemaQuery } from '../../page/passwordSet/controller.tsx';
export namespace NSControllerPagePasswordSet {
  export const querySchema = ControllerPagePasswordSetSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPagePasswordSetSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPagePasswordSetSchemaQuery>;
}

export const ZPagePasswordSet = createZovaComponentPage(
  ControllerPagePasswordSet,
  undefined,
  undefined,
);
