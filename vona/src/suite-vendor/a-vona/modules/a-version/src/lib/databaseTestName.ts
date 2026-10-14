import { getDatabaseTestPrefix } from 'vona';

export { getDatabaseTestPrefix };

const DATABASE_NAME_MAX_BYTES = 63;

export function createDatabaseTestName(databasePrefix: string, timestamp: string): string {
  const databaseName = `${databasePrefix}${timestamp}`;
  if (Buffer.byteLength(databaseName, 'utf8') > DATABASE_NAME_MAX_BYTES) {
    throw new Error(`test database name exceeds ${DATABASE_NAME_MAX_BYTES} bytes`);
  }
  return databaseName;
}
