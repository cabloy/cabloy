import { Buffer } from 'node:buffer';

import { mcpRequestSiteId } from './resourceServer.ts';

export interface IProtocolIngressInput {
  rawHeaders: readonly string[];
  target: string | undefined;
  method: string | undefined;
  /** Optional framework instance header permitted as a singleton. */
  instanceHeader?: string;
  /** Explicit shared-listener profile; fixtures always reject credentials. */
  authentication?: 'bearer';
}

export interface IFixtureIngressInput extends Omit<
  IProtocolIngressInput,
  'instanceHeader' | 'authentication'
> {
  peer: string | undefined;
  /** Server-owned authority derived from the fixture's allocated IPv4 listener. */
  host: string;
  instanceHeaders: readonly string[];
}

export interface IFixtureIngressDenial {
  status: number;
  allow?: string;
}

export const fixtureIngressLimits = Object.freeze({
  headerBytes: 8 * 1024,
  headerFields: 32,
  headerValueBytes: 2 * 1024,
  targetBytes: 256,
});

const headerToken = /^[!#$%&'*+.^`|~\w-]+$/;
const singletonHeaders = new Set([
  'accept',
  'content-type',
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'expect',
  'trailer',
  'te',
  'last-event-id',
]);
const overrideHeaders = new Set(['x-http-method-override', 'x-method-override', 'x-http-method']);
const credentialHeaders = new Set(['authorization', 'cookie', 'proxy-authorization']);

/**
 * Direct-only admission for the synthetic fixture and explicit local commerce
 * verification entry; neither is production ingress.
 * Undefined admits. Denials contain no caller-controlled values or diagnostics.
 * The listener must separately enforce native parser/receive bounds before this
 * function, and body, capacity and lifetime bounds after it.
 */
export function checkFixtureIngress(
  input: IFixtureIngressInput,
): IFixtureIngressDenial | undefined {
  return checkIngress(input, input);
}

/** Protocol/framing checks without fixture-local peer, Host or Origin policy. */
export function checkProtocolIngress(
  input: IProtocolIngressInput,
): IFixtureIngressDenial | undefined {
  return checkIngress(input);
}

function checkIngress(
  input: IProtocolIngressInput,
  local?: IFixtureIngressInput,
): IFixtureIngressDenial | undefined {
  const headers = new Map<string, { value: string; count: number }>();
  const bearer = !local && input.authentication === 'bearer';
  const instanceHeader = input.instanceHeader?.toLowerCase();
  const selectors = new Set(local?.instanceHeaders.map(name => name.toLowerCase()));
  selectors.add('x-vona-instance-name');
  let unsafeHeader = false;
  let malformedHeaders = input.rawHeaders.length % 2 !== 0;
  let duplicateSingleton = false;
  let oversizedValue = false;
  // Canonical field lines (": " and CRLF), plus the terminating empty line.
  // Native maxHeaderSize also covers bytes unavailable in parsed rawHeaders.
  let headerBytes = 2;
  for (let index = 0; index < input.rawHeaders.length; index += 2) {
    const rawName = input.rawHeaders[index];
    const value = input.rawHeaders[index + 1] ?? '';
    const name = rawName.toLowerCase();
    const previous = headers.get(name);
    if (previous) {
      previous.count++;
      if (
        singletonHeaders.has(name) ||
        name.startsWith('mcp-') ||
        (!local && (name === 'host' || name === 'origin' || name === instanceHeader))
      ) {
        duplicateSingleton = true;
      }
    } else {
      headers.set(name, { value, count: 1 });
    }
    if (!headerToken.test(rawName) || hasInvalidHeaderValue(value)) {
      malformedHeaders = true;
    }
    if (
      name === 'forwarded' ||
      name.startsWith('x-forwarded-') ||
      (credentialHeaders.has(name) && !(bearer && name === 'authorization')) ||
      (selectors.has(name) && (local || name !== instanceHeader))
    ) {
      unsafeHeader = true;
    }
    const valueBytes = Buffer.byteLength(value, 'utf8');
    if (valueBytes > fixtureIngressLimits.headerValueBytes) {
      oversizedValue = true;
    }
    headerBytes += Buffer.byteLength(rawName, 'utf8') + valueBytes + 4;
  }

  if (local) {
    // Keep the standalone fixture's original authority and denial precedence.
    const origin = headers.get('origin');
    if (origin && (origin.count !== 1 || origin.value !== `http://${local.host}`)) {
      return { status: 403 };
    }
    const expectedHost = /^127\.0\.0\.1:([1-9]\d{0,4})$/.exec(local.host);
    const host = headers.get('host');
    if (
      local.peer !== '127.0.0.1' ||
      !expectedHost ||
      Number(expectedHost[1]) > 65535 ||
      !host ||
      host.count !== 1 ||
      host.value !== local.host
    ) {
      return { status: 403 };
    }
  }
  if (unsafeHeader) return { status: 403 };

  // Oversized targets get the specific URL-bound denial rather than generic 404.
  if (
    input.target !== undefined &&
    Buffer.byteLength(input.target, 'utf8') > fixtureIngressLimits.targetBytes
  ) {
    return { status: 414 };
  }
  if (local ? input.target !== '/mcp' : !mcpRequestSiteId(input.target ?? '')) {
    return { status: 404 };
  }

  const contentLength = headers.get('content-length')?.value;
  const transferEncoding = headers.get('transfer-encoding')?.value;
  const invalidLength =
    contentLength !== undefined &&
    (!/^\d+$/.test(contentLength) || !Number.isSafeInteger(Number(contentLength)));
  const invalidTransfer =
    transferEncoding !== undefined && transferEncoding.trim().toLowerCase() !== 'chunked';
  if (
    malformedHeaders ||
    duplicateSingleton ||
    invalidLength ||
    invalidTransfer ||
    (contentLength !== undefined && transferEncoding !== undefined) ||
    [...overrideHeaders].some(name => headers.has(name))
  ) {
    return { status: 400 };
  }

  // In particular, bodyless GET/DELETE must not become a media-type failure.
  if (input.method !== 'POST') {
    return { status: 405, allow: 'POST' };
  }

  const contentType = headers.get('content-type')?.value;
  const contentEncoding = headers.get('content-encoding')?.value;
  if (
    contentType === undefined ||
    !/^application\/json(?:[ \t]*;[ \t]*charset[ \t]*=[ \t]*(?:utf-8|"utf-8"))?$/i.test(
      contentType.trim(),
    ) ||
    (contentEncoding !== undefined && contentEncoding.trim().toLowerCase() !== 'identity')
  ) {
    return { status: 415 };
  }
  if (!acceptsFixtureResponses(headers.get('accept')?.value)) {
    return { status: 406 };
  }

  if (
    headerBytes > fixtureIngressLimits.headerBytes ||
    input.rawHeaders.length / 2 > fixtureIngressLimits.headerFields ||
    oversizedValue
  ) {
    return { status: 431 };
  }
  if (bearer) {
    const authorization = headers.get('authorization');
    if (
      !authorization ||
      authorization.count !== 1 ||
      !/^Bearer [\w.~+/-]+=*$/i.test(authorization.value)
    ) {
      return { status: 401 };
    }
  }
  return undefined;
}

function hasInvalidHeaderValue(value: string): boolean {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if ((code < 32 && code !== 9) || code === 127) {
      return true;
    }
  }
  return false;
}

function acceptsFixtureResponses(value: string | undefined): boolean {
  if (value === undefined) {
    return false;
  }
  let json = false;
  let eventStream = false;
  for (const entry of value.split(',')) {
    const parts = entry.split(';');
    const mediaType = parts[0].trim().toLowerCase();
    const mediaParts = mediaType.split('/');
    if (
      mediaParts.length !== 2 ||
      !headerToken.test(mediaParts[0]) ||
      !headerToken.test(mediaParts[1]) ||
      (mediaParts[0] === '*' && mediaParts[1] !== '*')
    ) {
      return false;
    }
    let quality = 1;
    let supportedParameters = true;
    const seen = new Set<string>();
    for (const part of parts.slice(1)) {
      const parameter =
        /^([!#$%&'*+.^`|~\w-]+)[ \t]*=[ \t]*([!#$%&'*+.^`|~\w-]+|"[^"\\\r\n]*")$/.exec(part.trim());
      if (!parameter) {
        return false;
      }
      const name = parameter[1].toLowerCase();
      const parameterValue = parameter[2];
      if (seen.has(name)) {
        return false;
      }
      seen.add(name);
      if (name === 'q') {
        if (!/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(parameterValue)) {
          return false;
        }
        quality = Number(parameterValue);
      } else if (name !== 'charset' || !/^(?:utf-8|"utf-8")$/i.test(parameterValue)) {
        supportedParameters = false;
      }
    }
    // The selected profile requires both explicit media types, not just */*.
    if (quality > 0 && supportedParameters) {
      if (mediaType === 'application/json') {
        json = true;
      }
      if (mediaType === 'text/event-stream') {
        eventStream = true;
      }
    }
  }
  return json && eventStream;
}
