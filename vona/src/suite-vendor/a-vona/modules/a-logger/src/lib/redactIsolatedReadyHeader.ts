export function redactIsolatedReadyHeader<HEADERS extends Record<string, unknown>>(
  headers: HEADERS,
  path: string,
  runId: string | undefined,
  header: string | string[],
): HEADERS {
  if (!['/health/ready', '/health/test-stop'].includes(path) || !runId) return headers;
  const redacted = { ...headers };
  const names = (Array.isArray(header) ? header : [header]).map(name => name.toLowerCase());
  for (const name of Object.keys(redacted)) {
    if (names.includes(name.toLowerCase())) delete redacted[name];
  }
  return redacted;
}
