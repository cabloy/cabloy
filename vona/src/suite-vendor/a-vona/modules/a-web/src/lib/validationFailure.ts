import type { VonaContext } from 'vona';
import type { IValidationFailureObserver } from 'vona-module-a-executor';
import type { RouteHandlerArgumentMeta } from 'vona-module-a-openapi';
import type z from 'zod';

import { SymbolValidationFailureCapture } from 'vona-module-a-executor';

export function parameterValidationFailure(ctx: VonaContext, metadata: RouteHandlerArgumentMeta) {
  const observer = ctx.state[SymbolValidationFailureCapture] as
    | IValidationFailureObserver
    | undefined;
  if (!observer || observer.context !== ctx) return undefined;
  const location = metadata.type === 'param' ? 'params' : metadata.type;
  return (issues: z.ZodIssue[]) => observer.capture.capture(location, issues);
}
