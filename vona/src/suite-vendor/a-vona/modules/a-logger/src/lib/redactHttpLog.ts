const safeHeaders = new Set(['accept', 'content-type', 'content-length']);

export function redactHttpLogHeaders(headers: Record<string, unknown>): Record<string, unknown> {
  // Allowlist diagnostic metadata so custom credential headers are covered too.
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      safeHeaders.has(key.toLowerCase()) ? value : '[REDACTED]',
    ]),
  );
}

export function redactHttpLogUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const boundary = value.search(/[?#]/);
  let path = boundary < 0 ? value : value.slice(0, boundary);
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(path) || path.startsWith('//')) {
    try {
      const url = new URL(path, 'http://redacted.invalid');
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return '[REDACTED]';
      path = `${path.startsWith('//') ? '//' : `${url.protocol}//`}${url.host}${url.pathname}`;
    } catch {
      return '[REDACTED]';
    }
  } else if (!path.startsWith('/') && path !== '*') {
    return '[REDACTED]';
  }
  // Query names can be configured by authentication clients; omit the whole query/fragment.
  return `${path}${boundary < 0 ? '' : '?[REDACTED]'}`;
}
