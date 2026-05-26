import type Router from 'find-my-way';
import type { Config } from 'find-my-way';
import type { VonaApplication } from 'vona';

export function config(_app: VonaApplication) {
  return {
    router: {
      maxParamLength: 500,
      defaultRoute: (_req, _res) => {},
    } as Config<Router.HTTPVersion.V1>,
  };
}
