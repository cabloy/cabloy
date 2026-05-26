import fse from 'fs-extra';
import path from 'node:path';
export function resolveTemplatePath(file) {
    return new URL(path.join('../templates', file), import.meta.url);
}
export async function loadJSONFile(fileName) {
    const pkgContent = (await fse.readFile(fileName)).toString();
    return JSON.parse(pkgContent);
}
export async function saveJSONFile(fileName, json) {
    await fse.writeFile(fileName, `${JSON.stringify(json, null, 2)}\n`);
}
//# sourceMappingURL=utils.js.map