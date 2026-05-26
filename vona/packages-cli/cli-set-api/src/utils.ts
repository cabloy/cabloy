import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function resolveTemplatePath(file: string) {
  const url = new URL(path.join('../templates', file), import.meta.url);
  return fileURLToPath(url);
}
