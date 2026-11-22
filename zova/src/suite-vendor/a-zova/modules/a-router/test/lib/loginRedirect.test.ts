import { createMemoryHistory, createRouter } from '@cabloy/vue-router';
import assert from 'node:assert/strict';
import test from 'node:test';

import { getLoginReturnTo, isLoginPage } from '../../src/lib/loginRedirect.ts';

const router = createRouter({
  history: createMemoryHistory('/admin'),
  routes: [
    {
      path: '/home/login',
      alias: '/login',
      component: {},
      children: [{ path: '', component: {} }],
    },
    { path: '/home/login/register', component: {} },
    { path: '/rest/resource/:resource', component: {} },
    { path: '/:catchAll(.*)*', name: '$:/:catchAll(.*)*', component: {} },
  ],
});
const isLogin = (pagePath: string) => isLoginPage(pagePath, '/login', router);
const options = { origin: 'http://localhost:7102', publicPath: 'admin' };

test('recognizes the login route on both paths even with query and hash', () => {
  assert.ok(isLogin('/login?returnTo=%2Fresource#top'));
  assert.ok(isLogin('/home/login?returnTo=%2Fresource#top'));
  assert.ok(isLogin('/login/'));
  assert.ok(!isLogin('/home/login/register'));
});

test('a valid return target preserves the full route or same-origin document URL', () => {
  const pagePath = '/rest/resource/training-student%3Astudent?time=10:30#details';
  assert.equal(getLoginReturnTo(pagePath, isLogin, options), pagePath);
  const documentUrl = `${options.origin}/api/test/ssr/toolOne/test/12?x=1`;
  assert.equal(getLoginReturnTo(documentUrl, isLogin, options), documentUrl);
});

test('a return target must be a single local destination and not login', () => {
  for (const target of [
    '/login?returnTo=%2Frest%2Fresource%2Fstudent',
    '/home/login#top',
    '/admin/login?returnTo=%2Fresource',
    `${options.origin}/admin/login`,
    'https://example.test/path',
    '//example.test/path',
    ['/first', '/second'],
  ]) {
    assert.equal(getLoginReturnTo(target, isLogin, options), undefined);
  }
});
