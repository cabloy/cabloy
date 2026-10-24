import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageDashboard } from './.metadata/page/dashboard.ts';

export const routes: IModuleRoute[] = [
  //
  { path: 'dashboard', component: ZPageDashboard, meta: { ssrProfile: 'session' } },
];
