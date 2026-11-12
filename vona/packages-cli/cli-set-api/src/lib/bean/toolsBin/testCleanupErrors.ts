const reasons = {
  identity: 'cleanup config identity mismatch',
  mode: 'unsupported cleanup config mode',
  databaseClient: 'cleanup database client missing',
  databaseEndpoint: 'cleanup database endpoint drift',
  databaseNamespace: 'cleanup database namespace drift',
  databaseScope: 'cleanup database scope drift',
  databaseAdmin: 'cleanup administrative target drift',
  redisTarget: 'unsupported cleanup Redis prefix',
  redisEndpoint: 'cleanup Redis endpoint or namespace drift',
  redisPrefix: 'cleanup Redis prefix drift',
} as const;

type TestCleanupConfigCode = keyof typeof reasons;

export function isTestCleanupConfigCode(value: unknown): value is TestCleanupConfigCode {
  return typeof value === 'string' && Object.hasOwn(reasons, value);
}

// Only fixed categories may cross IPC or become diagnostics, never raw config errors.
export class TestCleanupConfigError extends Error {
  readonly reasonCode: TestCleanupConfigCode;

  constructor(code: TestCleanupConfigCode) {
    super(reasons[code]);
    this.reasonCode = code;
  }
}
