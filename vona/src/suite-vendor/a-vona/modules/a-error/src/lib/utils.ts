import type { VonaContext } from 'vona';

export function accepts(ctx: VonaContext) {
  if (ctx.acceptJSON) return 'json';
  return 'html';
}
