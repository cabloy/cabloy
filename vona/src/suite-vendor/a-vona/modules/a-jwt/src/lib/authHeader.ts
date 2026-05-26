const re = /(\S+)\s+(\S+)/;

export function parseAuthHeader(headerValue?: any) {
  if (typeof headerValue !== 'string') return;
  const matches = headerValue.match(re);
  return matches && { scheme: matches[1], value: matches[2] };
}
