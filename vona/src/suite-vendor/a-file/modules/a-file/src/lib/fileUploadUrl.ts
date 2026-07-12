import fse from 'fs-extra';
import { lookup as dnsLookup } from 'node:dns/promises';
import https from 'node:https';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';

import type { IFileUploadUrlPolicyResolved } from '../types/file.ts';

import { getFileExtension, matchesFileMimeType } from './fileUploadValidation.ts';

const MAX_REDIRECTS = 3;
const CONNECT_TIMEOUT = 10_000;
const RESPONSE_TIMEOUT = 15_000;
const READ_TIMEOUT = 15_000;
const OVERALL_TIMEOUT = 30_000;

export interface IRemoteFileUploadUrlInput {
  url: string;
  filename?: string;
  policy: IFileUploadUrlPolicyResolved;
}

export interface IRemoteFileUploadUrlResult {
  file: string;
  filename: string;
  contentType?: string;
  size: number;
  cleanup: () => Promise<void>;
}

interface IRemoteResponse {
  request: import('node:http').ClientRequest;
  response: import('node:http').IncomingMessage;
}

export async function downloadFileUploadUrl(
  input: IRemoteFileUploadUrlInput,
): Promise<IRemoteFileUploadUrlResult> {
  const tempDir = await fse.mkdtemp(path.join(os.tmpdir(), 'cabloy-file-url-'));
  let active: import('node:http').ClientRequest | import('node:http').IncomingMessage | undefined;
  const overallTimer = setTimeout(() => {
    active?.destroy(new Error('Remote file fetch timed out'));
  }, OVERALL_TIMEOUT);
  try {
    let url = validateRemoteUrl(input.url);
    let remote: IRemoteResponse | undefined;
    for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
      remote = await requestRemote(url, item => {
        active = item;
      });
      const location = remote.response.headers.location;
      if (isRedirect(remote.response.statusCode) && location) {
        if (redirects === MAX_REDIRECTS) {
          throw new Error(`Remote file exceeded redirect limit: ${MAX_REDIRECTS}`);
        }
        remote.response.resume();
        url = validateRemoteUrl(new URL(location, url).toString());
        continue;
      }
      break;
    }
    if (!remote || isRedirect(remote.response.statusCode)) {
      throw new Error('Remote file redirect response is missing a location');
    }
    if (
      !remote.response.statusCode ||
      remote.response.statusCode < 200 ||
      remote.response.statusCode >= 300
    ) {
      throw new Error(`Remote file fetch failed: ${remote.response.statusCode ?? 0}`);
    }

    const filename = sanitizeFilename(input.filename) ?? filenameFromUrl(url);
    validateExtension(filename, input.policy);
    const contentType = normalizeContentType(remote.response.headers['content-type']);
    validateContentType(contentType, input.policy);
    const contentLength = parseContentLength(remote.response.headers['content-length']);
    if (contentLength !== undefined) validateSize(contentLength, input.policy);

    const file = path.join(tempDir, 'download');
    let size = 0;
    const limit = new Transform({
      transform(chunk: Buffer, _encoding, callback) {
        size += chunk.length;
        try {
          validateSize(size, input.policy);
          callback(null, chunk);
        } catch (error) {
          callback(error as Error);
        }
      },
    });
    remote.response.setTimeout(READ_TIMEOUT, () => {
      remote.response.destroy(new Error('Remote file read timed out'));
    });
    active = remote.response;
    await pipeline(remote.response, limit, fse.createWriteStream(file, { mode: 0o600 }));
    validateSize(size, input.policy);
    return {
      file,
      filename,
      contentType,
      size,
      cleanup: async () => await fse.remove(tempDir),
    };
  } catch (error) {
    await fse.remove(tempDir);
    throw error;
  } finally {
    clearTimeout(overallTimer);
  }
}

function validateRemoteUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError('Remote file URL is invalid');
  }
  if (url.protocol !== 'https:') {
    throw new TypeError('Remote file URL must use HTTPS');
  }
  if (url.username || url.password) {
    throw new TypeError('Remote file URL must not include credentials');
  }
  if (url.port && url.port !== '443') {
    throw new TypeError('Remote file URL must use port 443');
  }
  if (!url.hostname) {
    throw new TypeError('Remote file URL must include a hostname');
  }
  return url;
}

async function requestRemote(
  url: URL,
  setActive: (
    item: import('node:http').ClientRequest | import('node:http').IncomingMessage,
  ) => void,
): Promise<IRemoteResponse> {
  const address = await resolvePublicAddress(url.hostname);
  return await new Promise<IRemoteResponse>((resolve, reject) => {
    let settled = false;
    const rejectOnce = (error: Error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    const request = https.request(
      url,
      {
        agent: false,
        lookup(hostname, _options, callback) {
          if (hostname !== url.hostname) {
            callback(
              Object.assign(new Error('Remote file DNS hostname mismatch'), {
                code: 'EHOSTUNREACH',
              }),
              address.address,
              address.family,
            );
            return;
          }
          callback(null, address.address, address.family);
        },
      },
      response => {
        if (settled) {
          response.destroy();
          return;
        }
        settled = true;
        response.setTimeout(RESPONSE_TIMEOUT, () => {
          response.destroy(new Error('Remote file response timed out'));
        });
        setActive(response);
        resolve({ request, response });
      },
    );
    request.setTimeout(CONNECT_TIMEOUT, () => {
      request.destroy(new Error('Remote file connection timed out'));
    });
    request.once('error', rejectOnce);
    setActive(request);
    request.end();
  });
}

async function resolvePublicAddress(hostname: string) {
  const literalFamily = net.isIP(hostname);
  const addresses = literalFamily
    ? [{ address: hostname, family: literalFamily }]
    : await dnsLookup(hostname, { all: true, verbatim: true });
  if (!addresses.length) throw new Error('Remote file hostname did not resolve');
  for (const address of addresses) {
    if (!isPublicAddress(address.address, address.family)) {
      throw new Error(`Remote file hostname resolved to a prohibited address: ${address.address}`);
    }
  }
  return addresses[0]!;
}

function isRedirect(statusCode?: number) {
  return [301, 302, 303, 307, 308].includes(statusCode ?? 0);
}

function normalizeContentType(value: string | string[] | undefined) {
  const contentType = Array.isArray(value) ? value[0] : value;
  return contentType?.split(';', 1)[0]?.trim().toLowerCase() || undefined;
}

function parseContentLength(value: string | string[] | undefined) {
  const contentLength = Array.isArray(value) ? value[0] : value;
  if (contentLength === undefined) return undefined;
  if (!/^\d+$/.test(contentLength)) throw new Error('Remote file Content-Length is invalid');
  const size = Number(contentLength);
  if (!Number.isSafeInteger(size)) throw new Error('Remote file Content-Length is invalid');
  return size;
}

function validateSize(size: number, policy: IFileUploadUrlPolicyResolved) {
  if (policy.maxSize !== undefined && size > policy.maxSize) {
    throw new Error(`Remote file is too large: maxSize=${policy.maxSize}`);
  }
}

function validateContentType(
  contentType: string | undefined,
  policy: IFileUploadUrlPolicyResolved,
) {
  if (
    policy.mimeTypes?.length &&
    (!contentType || !matchesFileMimeType(contentType, policy.mimeTypes))
  ) {
    throw new Error(`Unsupported remote file mimeType: ${contentType ?? 'missing'}`);
  }
}

function validateExtension(filename: string, policy: IFileUploadUrlPolicyResolved) {
  const extension = getFileExtension(filename);
  if (policy.extensions?.length && !policy.extensions.includes(extension)) {
    throw new Error(`Unsupported remote file extension: ${extension || 'missing'}`);
  }
}

function filenameFromUrl(url: URL) {
  const pathname = decodeURIComponent(url.pathname);
  return sanitizeFilename(path.posix.basename(pathname)) ?? 'download';
}

function sanitizeFilename(value: string | undefined) {
  if (!value) return undefined;
  const filename = path
    .basename(value.replaceAll('\\', '/'))
    .replace(/\p{Cc}/gu, '')
    .trim();
  return filename || undefined;
}

function isPublicAddress(address: string, family: number) {
  if (family === 4) return isPublicIpv4(address);
  if (family === 6) return isPublicIpv6(address);
  return false;
}

function isPublicIpv4(address: string) {
  const octets = address.split('.').map(Number);
  if (
    octets.length !== 4 ||
    octets.some(item => !Number.isInteger(item) || item < 0 || item > 255)
  ) {
    return false;
  }
  const [a, b, c] = octets;
  if (a === 0 || a === 10 || a === 127 || a >= 224) return false;
  if (a === 100 && b >= 64 && b <= 127) return false;
  if (a === 169 && b === 254) return false;
  if (a === 172 && b >= 16 && b <= 31) return false;
  if (a === 192 && (b === 0 || b === 168)) return false;
  if (a === 192 && b === 88 && c === 99) return false;
  if (a === 192 && b === 0 && c === 2) return false;
  if (a === 198 && (b === 18 || b === 19 || b === 51)) return false;
  if (a === 203 && b === 0 && c === 113) return false;
  return true;
}

function isPublicIpv6(address: string) {
  const normalized = address.toLowerCase();
  if (normalized === '::' || normalized === '::1') return false;
  const mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return isPublicIpv4(mapped[1]!);
  const value = parseIpv6(normalized);
  if (value === undefined) return false;
  if (inIpv6Range(value, 0xfc000000000000000000000000000000n, 7)) return false;
  if (inIpv6Range(value, 0xfe800000000000000000000000000000n, 10)) return false;
  if (inIpv6Range(value, 0xff000000000000000000000000000000n, 8)) return false;
  if (!inIpv6Range(value, 0x20000000000000000000000000000000n, 3)) return false;
  if (inIpv6Range(value, 0x20010db8000000000000000000000000n, 32)) return false;
  if (inIpv6Range(value, 0x2001000000000000000000000000000n, 32)) return false;
  if (inIpv6Range(value, 0x2002000000000000000000000000000n, 16)) return false;
  return true;
}

function parseIpv6(value: string): bigint | undefined {
  const parts = value.split('::');
  if (parts.length > 2) return undefined;
  const [head, tail] = parts;
  const left = head ? head.split(':') : [];
  const right = tail ? tail.split(':') : [];
  if ((tail === undefined && left.length !== 8) || left.length + right.length > 8) {
    return undefined;
  }
  const groups: string[] = [
    ...left,
    ...Array.from<string>({ length: 8 - left.length - right.length }).fill('0'),
    ...right,
  ];
  if (groups.some(group => !/^[0-9a-f]{1,4}$/.test(group))) return undefined;
  return groups.reduce<bigint>((result, group) => (result << 16n) + BigInt(`0x${group}`), 0n);
}

function inIpv6Range(value: bigint, prefix: bigint, bits: number) {
  const mask = ((1n << BigInt(bits)) - 1n) << BigInt(128 - bits);
  return (value & mask) === (prefix & mask);
}
