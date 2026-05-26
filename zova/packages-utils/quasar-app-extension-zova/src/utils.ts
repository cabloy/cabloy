import fse from 'fs-extra';
import path from 'node:path';

export function resolveTemplatePath(file: string) {
  return new URL(path.join('../templates', file), import.meta.url);
}

export async function loadJSONFile(fileName: string) {
  const pkgContent = (await fse.readFile(fileName)).toString();
  return JSON.parse(pkgContent);
}

export async function saveJSONFile(fileName: string, json: object) {
  await fse.writeFile(fileName, `${JSON.stringify(json, null, 2)}\n`);
}
