import { createHash } from 'vona';

const hashEncoding = 'base64url';

export function compactProviderReference(
  purpose: string,
  source: string,
  maxLength: number,
): string {
  if (source.length <= maxLength) return source;

  const digest = createHash(`${purpose}\0${source}`, hashEncoding, 'sha256');
  const reference = `${purpose}:${digest}`;
  if (reference.length > maxLength) {
    throw new RangeError('provider reference maximum length is too small');
  }
  return reference;
}
