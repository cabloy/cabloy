import type { Router } from '@cabloy/vue-router';

export function isLoginPage(
  pagePath: string | undefined,
  loginPath: string,
  router?: Pick<Router, 'resolve'>,
): boolean {
  if (!pagePath) return false;
  const pathname = pagePath.split(/[?#]/, 1)[0];
  if (pathname === loginPath) return true;
  if (!router) return false;
  const login = router.resolve(loginPath).matched.at(-1);
  const target = router.resolve(pathname).matched.at(-1);
  return (
    !!login &&
    login.name !== '$:/:catchAll(.*)*' &&
    (login.aliasOf ?? login) === (target?.aliasOf ?? target)
  );
}

export function getLoginReturnTo(
  target: unknown,
  isLogin: (pagePath: string) => boolean,
  options: { origin?: string; publicPath?: string },
): string | undefined {
  if (typeof target !== 'string' || !target) return;
  const local = target.startsWith('/') && !target.startsWith('//');
  // Vona SSR interceptors hand off same-origin document URLs rather than router-local paths.
  if (!local && (!options.origin || !/^https?:\/\//i.test(target))) return;
  const origin = options.origin ?? 'http://localhost';
  let url: URL;
  try {
    url = new URL(target, origin);
  } catch {
    return;
  }
  if (url.origin !== origin || url.username || url.password || url.pathname.startsWith('//'))
    return;
  const prefix = options.publicPath ? `/${options.publicPath}` : '';
  const sitePath =
    prefix && url.pathname.startsWith(`${prefix}/`)
      ? url.pathname.slice(prefix.length)
      : url.pathname;
  if (isLogin(sitePath) || (sitePath !== url.pathname && isLogin(url.pathname))) return;
  return local ? url.pathname + url.search + url.hash : url.href;
}
