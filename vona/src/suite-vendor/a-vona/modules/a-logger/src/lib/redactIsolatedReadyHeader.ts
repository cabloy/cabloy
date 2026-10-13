export function redactIsolatedReadyHeader<HEADERS extends Record<string, unknown>>(
  headers: HEADERS,
  path: string,
  runId: string | undefined,
  header: string,
): HEADERS {
  if (path !== '/health/ready' || !runId) return headers;
  const redacted = { ...headers };
  delete redacted[header];
  return redacted;
}
