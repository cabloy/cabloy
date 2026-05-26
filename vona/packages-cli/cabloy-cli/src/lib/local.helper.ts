import type { IProcessHelperSpawnOptions } from '@cabloy/process-helper';
import type { TableConstructorOptions } from 'cli-table3';

import * as ModuleInfo from '@cabloy/module-info';
import { ProcessHelper } from '@cabloy/process-helper';
import { combineResourceName } from '@cabloy/utils';
import Boxen from 'boxen';
import Chalk from 'chalk';
import TableClass from 'cli-table3';
import fse from 'fs-extra';
import gogocode from 'gogocode';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import tmp from 'tmp';

import type { NameMeta } from '../types/helper.ts';
import type { BeanCliBase } from './bean.cli.base.ts';

import { commandsConfig } from '../config.ts';
import { getRegistry } from '../registry.ts';

export interface ITempFileOptions {
  tmpdir?: string;
  prefix?: string;
  postfix?: string;
}

export class LocalHelper {
  cli: BeanCliBase;
  processHelper: ProcessHelper;

  constructor(cli) {
    this.cli = cli;
    this.processHelper = new ProcessHelper(this.cwd, this.console as any);
  }

  get options() {
    return this.cli.options;
  }

  get context() {
    return this.cli.options.context;
  }

  get console() {
    return this.cli.console;
  }

  get template() {
    return this.cli.template;
  }

  get moduleConfig() {
    return commandsConfig;
  }

  get chalk() {
    return this.newChalk();
  }

  get Table() {
    return TableClass;
  }

  get cwd() {
    return this.context.argv.projectPath;
  }

  newChalk(options?) {
    if (!options) {
      options = this.moduleConfig.helper.chalk.options;
    }
    return new Chalk.Instance(options);
  }

  newTable(options: TableConstructorOptions) {
    return new TableClass(options);
  }

  boxen({ text, options }: any) {
    if (!options) {
      options = this.moduleConfig.helper.boxen.options;
    }
    return Boxen(text, options);
  }

  gogocode(sourceCode: string, options?: gogocode.GoGoOption): gogocode.GoGoAST {
    return gogocode(sourceCode, options);
  }

  firstCharToLowerCase(name: string) {
    return name.charAt(0).toLowerCase() + name.substring(1);
  }

  firstCharToUpperCase(name: string) {
    return name.charAt(0).toUpperCase() + name.substring(1);
  }

  stringToCapitalize(str: string[] | string, separator: string): string {
    if (typeof str === 'string') str = str.split(separator);
    return str
      .map(name => {
        return this.firstCharToUpperCase(name);
      })
      .join('');
  }

  slashPrefixForPath(count: number) {
    if (count === 0) return './';
    return '../'.repeat(count);
  }

  parseNameMeta(name: string, ignores?: string[]): NameMeta {
    const original = name;
    const parts = original.split('/');
    const directory = parts.slice(0, parts.length - 1).join('/');
    const short = parts[parts.length - 1];
    const shortCapitalize = this.firstCharToUpperCase(short);
    let partsFull;
    if (ignores && parts.length > 1 && ignores.includes(parts[0])) {
      partsFull = parts.slice(1);
    } else {
      partsFull = parts;
    }
    if (partsFull.length > 1 && partsFull[0] === partsFull[1]) {
      partsFull = partsFull.slice(1);
    }
    const fullCapitalize = this.stringToCapitalize(partsFull, '/');
    const full = this.firstCharToLowerCase(fullCapitalize);
    return {
      original,
      parts,
      directory,
      short,
      shortCapitalize,
      full,
      fullCapitalize,
    };
  }

  parseModuleInfo(moduleName) {
    const moduleInfo = ModuleInfo.parseInfoPro(
      moduleName,
      process.env.CabloyCliBrandName as any,
      'module',
    );
    if (!moduleInfo) throw new Error(`module name is not valid: ${moduleName}`);
    return moduleInfo;
  }

  findModule(moduleName) {
    const moduleInfo = this.parseModuleInfo(moduleName);
    return this.cli.modulesMeta.modules[moduleInfo.relativeName];
  }

  parseSuiteInfo(suiteName) {
    const suiteInfo = ModuleInfo.parseInfoPro(
      suiteName,
      process.env.CabloyCliBrandName as any,
      'suite',
    );
    if (!suiteInfo) throw new Error(`suite name is not valid: ${suiteName}`);
    return suiteInfo;
  }

  findSuite(suiteName) {
    const suiteInfo = this.parseSuiteInfo(suiteName);
    return this.cli.modulesMeta.suites[suiteInfo.relativeName];
  }

  async ensureDir(dir) {
    await fse.ensureDir(dir);
    return dir;
  }

  async pnpmInstall() {
    // args
    const args = ['install'];
    if (process.env.GITHUB_ACTIONS === 'true') {
      args.push('--no-frozen-lockfile');
    }
    // log
    await this.console.log('===> pnpm install');
    // spawn
    await this.spawnCmd({
      cmd: 'pnpm',
      args,
    });
  }

  async formatFile({ fileName, logPrefix }: { fileName: string; logPrefix?: string }) {
    if (_formatFileDisable(fileName)) return;
    return await this.processHelper.formatFile({ fileName, logPrefix });
  }

  async spawnBin({
    cmd,
    args,
    options,
  }: {
    cmd: string;
    args?: string[];
    options?: IProcessHelperSpawnOptions;
  }): Promise<string> {
    return await this.processHelper.spawnBin({ cmd, args, options });
  }

  async spawnCmd({
    cmd,
    args,
    options,
  }: {
    cmd: string;
    args?: string[];
    options?: IProcessHelperSpawnOptions;
  }): Promise<string> {
    return await this.processHelper.spawnCmd({ cmd, args, options });
  }

  async spawnExe({
    cmd,
    args,
    options,
  }: {
    cmd: string;
    args?: string[];
    options?: IProcessHelperSpawnOptions;
  }): Promise<string> {
    return await this.processHelper.spawnExe({ cmd, args, options });
  }

  async spawn({
    cmd,
    args = [],
    options = {},
  }: {
    cmd: string;
    args?: string[];
    options?: IProcessHelperSpawnOptions;
  }): Promise<string> {
    return await this.processHelper.spawn({ cmd, args, options });
  }

  async gitCommit({ cwd, message }: any) {
    return await this.processHelper.gitCommit(message, { cwd });
  }

  async getRegistry() {
    return await getRegistry();
  }

  parseBrandPath() {
    const require = createRequire(import.meta.url);
    const modulePath = require.resolve(`${process.env.CabloyCliBrandName}-cli/package.json`);
    // ts or js
    let file = path.join(path.dirname(modulePath), `src/bin/${process.env.CabloyCliBrandName}.ts`);
    if (!fse.existsSync(file)) {
      file = path.join(path.dirname(modulePath), `dist/bin/${process.env.CabloyCliBrandName}.js`);
    }
    return file;
  }

  async invokeCli(args: string[], options) {
    await this.processHelper.spawnExe({
      cmd: 'node',
      args: [this.parseBrandPath()].concat(args),
      options,
    });
  }

  async loadJSONFile(fileName: string) {
    const pkgContent = (await fse.readFile(fileName)).toString();
    return JSON.parse(pkgContent);
  }

  async saveJSONFile(fileName: string, json: object, format?: boolean) {
    await fse.writeFile(fileName, `${JSON.stringify(json, null, 2)}\n`);
    if (format !== false) {
      await this.formatFile({ fileName });
    }
  }

  safeSplit(str: string, sep: string = ',') {
    let left = 0;
    let start = 0;
    const result: string[] = [];
    while (start < str.length) {
      let end = start;
      while (end < str.length) {
        if (str[end] === sep && left === 0) {
          result.push(str.substring(start, end));
          start = end + 1;
          break;
        }
        if (str[end] === '<') left++;
        if (str[end] === '>') left--;
        end++;
      }
      if (start < end) {
        result.push(str.substring(start, end));
        start = end + 1;
      }
    }
    if (start <= str.length) {
      result.push(str.substring(start, str.length));
    }
    return result;
  }

  async removeGitkeep(parentPath: string) {
    const gitkeep = path.join(parentPath, '.gitkeep');
    if (fse.existsSync(gitkeep)) {
      await fse.remove(gitkeep);
    }
  }

  combineModuleNameAndResource(moduleName: string, resourceName: string) {
    return combineResourceName(resourceName, moduleName, true, true);
  }

  async importDynamic(fileName: string): Promise<any>;
  async importDynamic<RESULT>(
    fileName: string,
    fn: (instance: any) => Promise<RESULT>,
  ): Promise<RESULT>;
  async importDynamic<RESULT>(
    fileName: string,
    fn?: (instance: any) => Promise<RESULT>,
  ): Promise<RESULT | any> {
    // load
    const instance = await import(this.pathToHref(fileName));
    if (!fn) return instance;
    return await fn(instance);
  }

  requireDynamic(file: string) {
    if (!file) throw new Error('file should not empty');
    const require = createRequire(import.meta.url);
    let instance = require(file);
    const mtime = this._requireDynamic_getFileTime(file);
    if (instance.__requireDynamic_mtime === undefined) {
      instance.__requireDynamic_mtime = mtime;
    } else if (instance.__requireDynamic_mtime !== mtime) {
      delete require.cache[require.resolve(file)];
      instance = require(file);
      instance.__requireDynamic_mtime = mtime;
    }
    return instance;
  }

  private _requireDynamic_getFileTime(file) {
    if (!path.isAbsolute(file)) return null;
    const exists = fse.pathExistsSync(file);
    if (!exists) return null;
    // stat
    const stat = fse.statSync(file);
    return stat.mtime.valueOf();
  }

  async tempFile<RESULT>(
    fn: (fileTemp: string) => Promise<RESULT>,
    options?: ITempFileOptions,
  ): Promise<RESULT> {
    // temp
    const fileTempObj = tmp.fileSync(options);
    const fileTemp = fileTempObj.name;
    try {
      return await fn(fileTemp);
    } finally {
      // delete temp
      fileTempObj.removeCallback();
    }
  }

  pathToHref(fileName: string): string {
    return pathToFileURL(fileName).href;
  }
}

function _formatFileDisable(fileName: string) {
  const baseName = path.basename(fileName);
  if (/.env\..*$/.test(baseName)) return true;
  if (['.env', 'docker-compose-dockerfile-app', 'docker-compose.yml'].includes(baseName))
    return true;
  return false;
}

// async importDynamic<RESULT>(fileName: string, fn: (instance: any) => Promise<RESULT>): Promise<RESULT> {
//   return await this.tempFile(
//     async fileTemp => {
//       // build
//       const esBuildConfig = this._createEsbuildConfig(fileName, fileTemp);
//       await esBuild(esBuildConfig as any);
//       // load
//       const instance = await import(this._pathToHref(fileTemp));
//       return await fn(instance);
//     },
//     {
//       tmpdir: path.dirname(fileName),
//       prefix: '.temp-dynamic-',
//       postfix: '.mjs',
//     },
//   );
// }

// private _createEsbuildConfig(fileSrc: string, fileDest: string) {
//   return {
//     platform: 'node',
//     format: 'esm',
//     bundle: true,
//     packages: 'external',
//     resolveExtensions: ['.mjs', '.js', '.mts', '.ts', '.json'],
//     entryPoints: [fileSrc],
//     outfile: fileDest,
//   };
// }
