import { IModuleRoute } from 'zova-module-a-router';

import { ZPageAccessTokens } from './.metadata/page/accessTokens.ts';
import { ZPageAuthorizations } from './.metadata/page/authorizations.ts';
import { ZPageConsent } from './.metadata/page/consent.ts';
import { ZPageScopes } from './.metadata/page/scopes.ts';

export const routes: IModuleRoute[] = [
  {
    path: 'consent',
    component: ZPageConsent,
    meta: { layout: 'empty', requiresAuth: true, ssrProfile: 'session' },
  },
  {
    path: 'authorizations',
    component: ZPageAuthorizations,
    meta: { layout: 'mine', requiresAuth: true, ssrProfile: 'session' },
  },
  {
    path: 'scopes',
    component: ZPageScopes,
    meta: { layout: 'mine', requiresAuth: true, ssrProfile: 'session' },
  },
  {
    path: 'accessTokens',
    component: ZPageAccessTokens,
    meta: { layout: 'mine', requiresAuth: true, ssrProfile: 'session' },
  },
];
