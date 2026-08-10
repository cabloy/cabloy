import type { IModuleRoute } from 'zova-module-a-router';

import { ZPageDashboard } from './.metadata/page/dashboard.js';

export const routes: IModuleRoute[] = [
  { path: 'dashboard', component: ZPageDashboard, meta: { ssrProfile: 'session' } },
];
