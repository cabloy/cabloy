import type { Next, VonaContext } from 'vona';

import { composeGuards } from './utils.ts';

export async function middlewareGuard(ctx: VonaContext, next: Next) {
  // check handler
  const handler = ctx.getHandler();
  if (!handler) return next();
  // compose
  const result = await composeGuards(ctx.app, ctx.route)(ctx);
  if (result === false) ctx.app.throw(403);
  // next
  return next();
}
