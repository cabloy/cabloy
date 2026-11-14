import type { Next } from 'vona';
import type {
  IDecoratorMiddlewareSystemOptions,
  IMiddlewareSystemExecute,
} from 'vona-module-a-aspect';
import type { BeanSsrSiteBase, IDecoratorSsrSiteOptions } from 'vona-module-a-ssr';

import { BeanBase } from 'vona';
import { MiddlewareSystem } from 'vona-module-a-aspect';

import type { IMcpAuthRegistrationRequest } from '../types/index.ts';

import {
  getMcpAuthConfig,
  mcpSupportedScopes,
  OAuthError,
  resolveMcpInstance,
  resolveMcpResourceUrl,
  requiredOAuthParameter,
} from '../lib/authorization.ts';

export interface IMiddlewareSystemOptionsAuthorization extends IDecoratorMiddlewareSystemOptions {}

const paths = new Set([
  '/mcp/auth',
  '/mcp/token',
  '/mcp/auth/summary',
  '/mcp/auth/decision',
  '/mcp/register',
  '/.well-known/oauth-authorization-server/mcp',
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
      const binding = resolveMcpInstance(this.app, host);
      const issuer = binding.issuer;
      this.ctx.instanceName = binding.instanceName as typeof this.ctx.instanceName;
      const config = getMcpAuthConfig(this.app);
      if (this.ctx.path === '/.well-known/oauth-authorization-server/mcp') {
        this.requireMethod('GET');
        if (url.search) throw new OAuthError('invalid_request');
        this.ctx.body = {
          issuer,
          authorization_endpoint: `${issuer}/auth`,
          token_endpoint: `${issuer}/token`,
          response_types_supported: ['code'],
          grant_types_supported: ['authorization_code', 'refresh_token'],
          code_challenge_methods_supported: ['S256'],
          token_endpoint_auth_methods_supported: ['none', 'client_secret_basic'],
          scopes_supported: mcpSupportedScopes,
          authorization_response_iss_parameter_supported: true,
          registration_endpoint: `${issuer}/register`,
        };
        return;
      }
      if (this.ctx.path === '/mcp/register') {
        this.requireMethod('POST');
        if (url.search) throw new OAuthError('invalid_request');
        if (this.singletonHeader('authorization') || this.singletonHeader('cookie')) {
          throw new OAuthError('invalid_request', 403);
        }
        await this.admitRegistration();
        await this.app.scope('a-instance').service.instance.initInstance();
        const request = (await this.readJson(
          config.registration!.maxBodyBytes,
        )) as unknown as IMcpAuthRegistrationRequest;
        this.ctx.status = 201;
        this.ctx.body = await this.scope.service.registration.register(request, binding);
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
      const resource = resolveMcpResourceUrl(
        this.app,
        requiredOAuthParameter(url.searchParams, 'resource'),
      );
      if (resource.instanceName !== binding.instanceName) throw new OAuthError('invalid_target');
      const sites = this.app.scope('a-ssr').service.ssr.getSitesEnabled();
      const site = sites.find(
        site =>
          (site.beanOptions.options as IDecoratorSsrSiteOptions).siteId === resource.ssrSiteId,
      );
      if (!site) throw new OAuthError('invalid_target');
      const siteInstance = this.bean._getBean<BeanSsrSiteBase>(
        site.beanOptions.beanFullName as any,
      );
      const request = await this.scope.service.authorization.authorize(url.searchParams, resource);
      this.$logger.debug('mcp.authorization.redirect site resolved');
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

  private async admitRegistration(): Promise<void> {
    const registration = getMcpAuthConfig(this.app).registration!;
    let result;
    try {
      result = await this.app.scope('a-ratelimit').service.rateLimit.admit({
        mode: 'enforce',
        limit: registration.rateLimit,
        windowMs: registration.rateLimitWindow * 1000,
        key: 'ip',
        name: 'mcp-register',
        route: { method: 'POST', path: '/mcp/register' },
        headers: true,
      });
    } catch (error) {
      if (error instanceof OAuthError) throw error;
      throw new OAuthError('temporarily_unavailable', 503);
    }
    this.ctx.set('RateLimit-Limit', String(result.limit));
    this.ctx.set('RateLimit-Remaining', String(result.remaining));
    this.ctx.set('RateLimit-Reset', String(Math.max(1, Math.ceil(result.resetAfterMs / 1000))));
    if (!result.allowed) {
      this.ctx.set('Retry-After', String(result.retryAfterSeconds));
      throw new OAuthError('temporarily_unavailable', 429);
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

  private async readJson(maxBytes: number): Promise<Record<string, unknown>> {
    const contentType = this.singletonHeader('content-type');
    if (!/^application\/json(?:;\s*charset=utf-8)?$/i.test(contentType ?? '')) {
      throw new OAuthError('invalid_client_metadata', 415);
    }
    if (this.singletonHeader('content-encoding'))
      throw new OAuthError('invalid_client_metadata', 415);
    if (this.singletonHeader('content-length')) {
      const length = Number(this.singletonHeader('content-length'));
      if (!Number.isSafeInteger(length) || length < 0 || length > maxBytes) {
        throw new OAuthError('invalid_client_metadata', 413);
      }
    }
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of this.ctx.req) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      size += buffer.length;
      if (size > maxBytes) throw new OAuthError('invalid_client_metadata', 413);
      chunks.push(buffer);
    }
    let body: string;
    try {
      body = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks));
      if (!body.trim()) throw new Error('empty');
      this.assertJsonObjectWithoutDuplicateKeys(body);
      const value = JSON.parse(body);
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('object');
      return value as Record<string, unknown>;
    } catch {
      throw new OAuthError('invalid_client_metadata');
    }
  }

  private assertJsonObjectWithoutDuplicateKeys(body: string): void {
    let index = 0;
    const whitespace = () => {
      while (/\s/.test(body[index] ?? '')) index++;
    };
    const string = (): string => {
      const start = index;
      if (body[index++] !== '"') throw new Error('string');
      while (index < body.length) {
        const character = body[index++];
        if (character === '\\') {
          if (index >= body.length) throw new Error('escape');
          index++;
        } else if (character === '"') {
          const raw = body.slice(start, index);
          const value = JSON.parse(raw);
          if (typeof value !== 'string') throw new TypeError('string');
          return value;
        }
      }
      throw new Error('string');
    };
    const value = () => {
      whitespace();
      const character = body[index];
      if (character === '{') {
        index++;
        whitespace();
        const keys = new Set<string>();
        if (body[index] === '}') {
          index++;
          return;
        }
        while (true) {
          const key = string();
          if (keys.has(key)) throw new Error('duplicate');
          keys.add(key);
          whitespace();
          if (body[index++] !== ':') throw new Error('colon');
          value();
          whitespace();
          if (body[index] === '}') {
            index++;
            return;
          }
          if (body[index++] !== ',') throw new Error('comma');
          whitespace();
        }
      }
      if (character === '[') {
        index++;
        whitespace();
        if (body[index] === ']') {
          index++;
          return;
        }
        while (true) {
          value();
          whitespace();
          if (body[index] === ']') {
            index++;
            return;
          }
          if (body[index++] !== ',') throw new Error('comma');
          whitespace();
        }
      }
      if (character === '"') {
        string();
        return;
      }
      if (!character || ',]}'.includes(character)) throw new Error('value');
      while (index < body.length && !/\\s/.test(body[index]) && !',]}'.includes(body[index])) {
        index++;
      }
    };
    value();
    whitespace();
    if (index !== body.length) throw new Error('trailing');
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
