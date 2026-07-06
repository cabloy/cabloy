import path from 'node:path';

export function matchesImageMimeType(mimeType: string, mimeTypes: string[]) {
  return mimeTypes.some(item => {
    if (item === mimeType) return true;
    if (item.endsWith('/*')) {
      return mimeType.startsWith(`${item.slice(0, -1)}`);
    }
    return false;
  });
}

export function getImageExtension(filename?: string) {
  return path.extname(filename ?? '').toLowerCase();
}
