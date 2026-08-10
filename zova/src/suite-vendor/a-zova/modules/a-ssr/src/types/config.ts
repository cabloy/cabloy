import '@cabloy/vue-router';
import type { ISsrRouteProfileOptions, TypeSsrProfile } from './ssr.js';

export interface ISsrConfig {
  cookieThemeDarkDefault: boolean;
}

declare module '@cabloy/vue-router' {
  export interface RouteMeta {
    ssrProfile?: TypeSsrProfile;
    ssrProfileOptions?: Readonly<ISsrRouteProfileOptions>;
  }
}
