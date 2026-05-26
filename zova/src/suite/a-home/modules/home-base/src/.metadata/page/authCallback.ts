import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageAuthCallback } from '../../page/authCallback/controller.jsx';
import { ControllerPageAuthCallbackSchemaQuery } from '../../page/authCallback/controller.jsx';
export namespace NSControllerPageAuthCallback {
  export const querySchema = ControllerPageAuthCallbackSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageAuthCallbackSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageAuthCallbackSchemaQuery>;
}

export const ZPageAuthCallback = createZovaComponentPage(
  ControllerPageAuthCallback,
  undefined,
  undefined,
);
