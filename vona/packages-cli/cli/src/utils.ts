import fse from 'fs-extra';

export async function loadJSONFile(fileName: string) {
  const pkgContent = (await fse.readFile(fileName)).toString();
  return JSON.parse(pkgContent);
}
