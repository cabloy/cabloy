import type { IncomingMessage, ServerResponse } from 'node:http';

import { captureRequestBoundary, createRequestBoundary, runWithRequestBoundary } from 'vona';

import type { ProductionOwnerContext, ProductionOwnerPorts } from './productionRequestOwner.ts';

import { createProductionRequestOwner, productionOwnerLimits } from './productionRequestOwner.ts';

// Explicit composition only; no bean, route, SDK or listener registration.
export function createRequestBoundaryOwner(limits: typeof productionOwnerLimits) {
  const owner = createProductionRequestOwner(limits);
  return {
    ...owner,
    run<C extends ProductionOwnerContext>(
      req: IncomingMessage,
      res: ServerResponse,
      ports: ProductionOwnerPorts<C>,
    ) {
      const boundary = createRequestBoundary();
      return runWithRequestBoundary(boundary, () => {
        const capture = captureRequestBoundary()!;
        return owner.run(req, res, {
          ...ports,
          boundaryFault: () => capture.snapshot().portFault || ports.boundaryFault?.() === true,
        });
      });
    },
  };
}
