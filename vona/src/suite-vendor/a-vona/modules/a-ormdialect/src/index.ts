export * from './.metadata/index.ts';
export { createProtectedSqliteRegistry } from './lib/protectedSqliteRegistry.ts';
export type {
  ProtectedSqliteRegistry,
  ProtectedSqliteRegistryCloseResult,
  ProtectedSqliteRegistryLookupOutcome,
  ProtectedSqliteRegistryLookupResult,
  ProtectedSqliteRegistryOptions,
  ProtectedSqliteRegistryPrepareResult,
  ProtectedSqliteRegistryRow,
  ProtectedSqliteRegistrySnapshot,
} from './lib/protectedSqliteRegistry.ts';
