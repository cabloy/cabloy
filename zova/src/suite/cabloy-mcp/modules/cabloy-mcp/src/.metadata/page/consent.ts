import { z } from 'zod';
import { createZovaComponentPage } from 'zova';

import { ControllerPageConsent } from '../../page/consent/controller.tsx';
import { ControllerPageConsentSchemaQuery } from '../../page/consent/controller.tsx';
export namespace NSControllerPageConsent {
  export const querySchema = ControllerPageConsentSchemaQuery;
  export type QueryInput = z.input<typeof ControllerPageConsentSchemaQuery>;
  export type QueryOutput = z.output<typeof ControllerPageConsentSchemaQuery>;
}

export const ZPageConsent = createZovaComponentPage(ControllerPageConsent, undefined, undefined);
