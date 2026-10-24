import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';
import type { BeanSsrSiteBase, IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import { getMcpAuthConfig, OAuthError, resolveMcpResource } from '../lib/authorization.ts';

export interface IMiddlewareSystemOptionsAuthorization extends IDecoratorMiddlewareSystemOptions {}

const paths = new Set([
  '/mcp/auth',
  '/mcp/token',
  '/mcp/auth/summary',
  '/mcp/auth/decision',
  '/.well-known/oauth-authorization-server',
]);

@MiddlewareSystem<IMiddlewareSystemOptionsAuthorization>({
  dependents: ['a-logger:httpLog', 'a-instance:app', 'a-instance:instance'],
})
export class MiddlewareSystemAuthorization extends BeanBase implements IMiddlewareSystemExecute {
  async execute(_options: IMiddlewareSystemOptionsAuthorization, next: Next) {
    if (!paths.has(this.ctx.path)) return next();
    this.ctx.set('Cache-Control', 'no-store');
    this.ctx.set('Referrer-Policy', 'no-referrer');
    this.ctx.set('X-Content-Type-Options', 'nosniff');
    try {
      if (!this.app.meta.appReady || this.app.meta.appClose) {
        throw new OAuthError('temporarily_unavailable', 503);
      }
      const url = URL.parse(this.ctx.req.url ?? '', 'http://mcp.invalid');
      if (
        !url ||
        this.ctx.req.url?.startsWith('//') ||
        this.ctx.req.url!.length > 8192 ||
        url.hash
      ) {
        throw new OAuthError('invalid_request');
      }
      const host = this.singletonHeader('host');
      if (
        !host ||
        this.ctx.req.rawHeaders.some(
          (name, index) =>
            index % 2 === 0 &&
            (name.toLowerCase() === 'forwarded' || name.toLowerCase().startsWith('x-forwarded-')),
        )
      ) {
        throw new OAuthError('invalid_request');
      }
      this.singletonHeader('origin');
      const resource = resolveMcpResource(this.app, host);
      const instanceQuery = this.app.config.instance.queryField;
      const instanceHeader = this.app.config.instance.headerField;
      if (
        url.searchParams.has('instanceName') ||
        (instanceQuery && url.searchParams.has(instanceQuery)) ||
        (instanceHeader && this.singletonHeader(instanceHeader)) ||
        this.singletonHeader('x-vona-instance-name')
      ) {
        throw new OAuthError('invalid_request');
      }
      // Host is only an exact registry selector, never an issuer/resource authority.
      this.ctx.instanceName = resource.instanceName as typeof this.ctx.instanceName;
      const config = getMcpAuthConfig(this.app);
      if (this.ctx.path === '/.well-known/oauth-authorization-server') {
        this.requireMethod('GET');
        if (url.search) throw new OAuthError('invalid_request');
        this.ctx.body = {
          issuer: config.issuer,
          authorization_endpoint: `${config.issuer}/mcp/auth`,
          token_endpoint: `${config.issuer}/mcp/token`,
          response_types_supported: ['code'],
          grant_types_supported: ['authorization_code'],
          code_challenge_methods_supported: ['S256'],
          token_endpoint_auth_methods_supported: ['none', 'client_secret_basic'],
          scopes_supported: ['mcp:read'],
          authorization_response_iss_parameter_supported: true,
        };
        return;
      }
      if (this.ctx.path === '/mcp/auth/summary' || this.ctx.path === '/mcp/auth/decision') {
        // The existing instance middleware and Passport guard own normal API admission.
        return await next();
      }
      await this.app.scope('a-instance').service.instance.initInstance();
      if (this.ctx.path === '/mcp/token') {
        this.requireMethod('POST');
        if (url.search) throw new OAuthError('invalid_request');
        const params = await this.readForm();
        this.ctx.body = await this.scope.service.authorization.exchange(
          params,
          this.singletonHeader('authorization'),
        );
        return;
      }
      this.requireMethod('GET');
      const sites = this.app.scope('a-ssr').service.ssr.getSitesEnabled();
      const site = sites.toSorted((left, right) => {
        const a = left.beanOptions.options as IDecoratorSsrSiteOptions;
        const b = right.beanOptions.options as IDecoratorSsrSiteOptions;
        return a.publicPath.length - b.publicPath.length;
      })[0];
      if (!site) throw new OAuthError('temporarily_unavailable', 503);
      const request = await this.scope.service.authorization.authorize(url.searchParams, resource);
      const siteInstance = this.bean._getBean<BeanSsrSiteBase>(
        site.beanOptions.beanFullName as any,
      );
      await siteInstance.redirect('/cabloy/mcp/consent' as any, { query: { request } } as any);
    } catch (error) {
      if (error instanceof Error && (error.code === 301 || error.code === 302)) throw error;
      if (this.ctx.path === '/mcp/auth/summary' || this.ctx.path === '/mcp/auth/decision') {
        if (error instanceof OAuthError) return this.app.throw(error.status);
        throw error;
      }
      const status = error instanceof OAuthError ? error.status : 503;
      this.ctx.status = status;
      if (status === 401) this.ctx.set('WWW-Authenticate', 'Basic realm="mcp-token"');
      this.ctx.body = {
        error: error instanceof OAuthError ? error.oauthError : 'temporarily_unavailable',
      };
    }
  }

  private requireMethod(method: string) {
    if (this.ctx.method !== method) {
      this.ctx.set('Allow', method);
      throw new OAuthError('invalid_request', 405);
    }
  }

  private singletonHeader(name: string): string | undefined {
    let value: string | undefined;
    for (let index = 0; index < this.ctx.req.rawHeaders.length; index += 2) {
      if (this.ctx.req.rawHeaders[index].toLowerCase() !== name.toLowerCase()) continue;
      if (value !== undefined) throw new OAuthError('invalid_request');
      value = this.ctx.req.rawHeaders[index + 1];
    }
    return value;
  }

  private async readForm(): Promise<URLSearchParams> {
    const contentType = this.singletonHeader('content-type');
    if (!/^application\/x-www-form-urlencoded(?:;\s*charset=utf-8)?$/i.test(contentType ?? '')) {
      throw new OAuthError('invalid_request', 415);
    }
    if (this.singletonHeader('content-encoding')) throw new OAuthError('invalid_request', 415);
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of this.ctx.req) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > 16384) throw new OAuthError('invalid_request', 413);
      chunks.push(buffer);
    }
    try {
      const body = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks));
      return new URLSearchParams(body);
    } catch {
      throw new OAuthError('invalid_request');
    }
  }
}
