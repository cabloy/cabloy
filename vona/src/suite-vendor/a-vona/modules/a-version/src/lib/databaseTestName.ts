import { createHash } from 'node:crypto';

const DATABASE_NAME_MAX_BYTES = 63;
const APP_NAME_MAX_BYTES = 13;
const HASH_LENGTH = 10;
const TIMESTAMP_LENGTH = 15;

export function getDatabaseTestPrefix(appName: string, scope: string): string {
  const readablePrefix = getReadablePrefix(appName, scope);
  if (Buffer.byteLength(readablePrefix, 'utf8') + TIMESTAMP_LENGTH <= DATABASE_NAME_MAX_BYTES) {
    return readablePrefix;
  }

  const appHead = truncateUtf8(appName, APP_NAME_MAX_BYTES);
  const scopeKind = scope === 'share' ? 's' : 'i';
  const namespaceHash = hash(`${appName}\0${scope}`);
  return `vona-test-${appHead}-${scopeKind}-${namespaceHash}-`;
}

export function createDatabaseTestName(databasePrefix: string, timestamp: string): string {
  const databaseName = `${databasePrefix}${timestamp}`;
  if (Buffer.byteLength(databaseName, 'utf8') > DATABASE_NAME_MAX_BYTES) {
    throw new Error(`test database name exceeds ${DATABASE_NAME_MAX_BYTES} bytes`);
  }
  return databaseName;
}

function getReadablePrefix(appName: string, scope: string): string {
  if (scope === 'share') return `vona-test-${appName}-s-`;
  return `vona-test-${appName}-i-${scope.slice('isolate-'.length)}-`;
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('base64url').slice(0, HASH_LENGTH);
}

function truncateUtf8(value: string, maxBytes: number): string {
  let result = '';
  let bytes = 0;
  for (const char of value) {
    const charBytes = Buffer.byteLength(char, 'utf8');
    if (bytes + charBytes > maxBytes) break;
    result += char;
    bytes += charBytes;
  }
  return result;
}
