// Cleanup primitives deliberately have no framework startup or connection dependencies.
export interface CleanupSqlConnection {
  raw(sql: string): Promise<unknown>;
  destroy(): Promise<unknown>;
}

export interface CleanupRedisConnection {
  scan(
    cursor: string,
    match: 'MATCH',
    pattern: string,
    count: 'COUNT',
    size: number,
  ): Promise<[string, string[]]>;
  unlink(...keys: string[]): Promise<unknown>;
  del(...keys: string[]): Promise<unknown>;
  disconnect(): unknown;
}

export function quoteCleanupDatabase(name: string, dialect: string): string {
  if (typeof name !== 'string' || !name || name.includes('\0')) {
    throw new Error('Invalid cleanup database identifier');
  }
  if (dialect === 'pg') return `"${name.replaceAll('"', '""')}"`;
  if (dialect === 'mysql' || dialect === 'mysql2') return `\`${name.replaceAll('`', '``')}\``;
  throw new Error('Unsupported cleanup database dialect');
}

export async function dropExactCleanupDatabase(
  connection: CleanupSqlConnection,
  dialect: string,
  name: string,
  validate: (name: string) => void,
) {
  // Never discover databases, terminate sessions, or use FORCE. IF EXISTS is the only
  // absent-resource accommodation; authentication and in-use failures propagate.
  try {
    validate(name);
    const identifier = quoteCleanupDatabase(name, dialect);
    if (dialect === 'pg') {
      await connection.raw("SET statement_timeout = '10000ms'");
      await connection.raw("SET lock_timeout = '3000ms'");
    }
    await connection.raw(`DROP DATABASE IF EXISTS ${identifier}`);
  } finally {
    await connection.destroy();
  }
}

export function escapeRedisCleanupPattern(prefix: string): string {
  return prefix.replace(/[\\*?[\]]/g, '\\$&');
}

function isUnsupportedUnlink(error: unknown): boolean {
  // Redis <4 can lack UNLINK. ACL, network, timeout and unrelated command errors
  // are never reasons to retry a destructive command using a different method.
  return (
    error instanceof Error && /^ERR unknown command ['"]?UNLINK['"]?(?:,|\s|$)/i.test(error.message)
  );
}

export async function clearExactRedisPrefix(
  connection: CleanupRedisConnection,
  prefix: string,
  validate: (prefix: string) => void,
  options: { batchSize?: number; maxScans?: number } = {},
) {
  const batchSize = options.batchSize ?? 128;
  const maxScans = options.maxScans ?? 100000;
  let useDel = false;
  let scans = 0;
  let cursor = '0';
  try {
    validate(prefix);
    if (
      !Number.isSafeInteger(batchSize) ||
      batchSize <= 0 ||
      batchSize > 1024 ||
      !Number.isSafeInteger(maxScans) ||
      maxScans <= 0
    ) {
      throw new Error('Invalid Redis cleanup bounds');
    }
    do {
      if (++scans > maxScans) throw new Error('Redis cleanup scan limit exceeded');
      const result = await connection.scan(
        cursor,
        'MATCH',
        `${escapeRedisCleanupPattern(prefix)}*`,
        'COUNT',
        // MATCH still traverses the whole database; keep scan work separate from
        // the bounded deletion batches to avoid excessive round trips.
        1024,
      );
      if (
        !Array.isArray(result) ||
        result.length !== 2 ||
        typeof result[0] !== 'string' ||
        !/^\d+$/.test(result[0]) ||
        !Array.isArray(result[1])
      ) {
        throw new Error('Invalid Redis cleanup scan response');
      }
      cursor = result[0];
      const keys = result[1];
      // Validate the entire response before the first deletion, not just each
      // batch. A server response outside the literal namespace is a hard stop.
      if (keys.some(key => typeof key !== 'string' || !key.startsWith(prefix))) {
        throw new Error('Redis cleanup scan returned a foreign key');
      }
      for (let offset = 0; offset < keys.length; offset += batchSize) {
        const batch = keys.slice(offset, offset + batchSize);
        if (useDel) {
          await connection.del(...batch);
        } else {
          try {
            await connection.unlink(...batch);
          } catch (error) {
            if (!isUnsupportedUnlink(error)) throw error;
            useDel = true;
            await connection.del(...batch);
          }
        }
      }
    } while (cursor !== '0');
  } finally {
    connection.disconnect();
  }
}
