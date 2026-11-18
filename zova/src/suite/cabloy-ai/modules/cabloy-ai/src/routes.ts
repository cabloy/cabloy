import { IModuleRoute } from 'zova-module-a-router';

import { ZPageChat } from './.metadata/page/chat.ts';

export const routes: IModuleRoute[] = [
  {
    path: 'chat',
    component: ZPageChat,
    meta: { requiresAuth: true, ssrProfile: 'session' },
  },
];
