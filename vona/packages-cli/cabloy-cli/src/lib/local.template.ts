import { catchError } from '@cabloy/utils';
import ejs from '@zhennann/ejs';
import fse from 'fs-extra';
import { globby } from 'globby';
import gogocode from 'gogocode';
import isTextOrBinary from 'istextorbinary';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { IEjsData, ISnippet, TypeParseLanguage } from '../types/template.ts';
import type { BeanCliBase } from './bean.cli.base.ts';

import { commandsConfig } from '../config.ts';

export class LocalTemplate {
  cli: BeanCliBase;

  constructor(cli) {
    this.cli = cli;
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

  get helper() {
    return this.cli.helper;
  }

  get moduleConfig() {
    return commandsConfig;
  }

  get fileMapping() {
    return this.moduleConfig.template.render.fileMapping;
  }

  get filesIgnore() {
    return this.moduleConfig.template.render.ignore;
  }

  resolveTemplatePath(setName: string, _path: string): string {
    if (path.isAbsolute(_path)) return _path;
    const sets = this.moduleConfig.sets;
    const require = createRequire(import.meta.url);
    const modulePath = require.resolve(
      `${sets[process.env.CabloyCliBrandName as any][setName]}/package.json`,
    );
    let templatePath = path.join(path.dirname(modulePath), 'dist-cli/templates', _path);
    if (!fse.existsSync(templatePath)) {
      templatePath = path.join(path.dirname(modulePath), 'cli/templates', _path);
    }
    return templatePath;
  }

  async renderBoilerplateAndSnippets({
    targetDir,
    setName,
    snippetsPath,
    boilerplatePath,
  }: {
    targetDir: string;
    setName: string;
    snippetsPath?: string | null | undefined;
    boilerplatePath?: string | null | undefined;
  }) {
    await this.helper.ensureDir(targetDir);
    // first
    if (snippetsPath) {
      const snippetsDir = this.resolveTemplatePath(setName, snippetsPath);
      await this.applySnippets(targetDir, snippetsDir);
    }
    // then
    if (boilerplatePath) {
      const templateDir = this.resolveTemplatePath(setName, boilerplatePath);
      await this.renderDir(targetDir, templateDir);
    }
  }

  async renderDir(targetDir: string, templateDir: string) {
    const { argv } = this.context;
    // files
    const files = await globby('**/*', {
      cwd: templateDir,
      dot: true,
      onlyFiles: false,
    });
    // loop
    for (const file of files) {
      const { dir: dirname, base: basename } = path.parse(file);
      if (this.filesIgnore.includes(basename)) continue;
      const templateFile = path.join(templateDir, file);
      const fileName = this.parseFileBaseName(basename);
      const parentPath = path.join(targetDir, dirname);
      const targetFile = path.join(parentPath, this.replaceTemplate(fileName, argv));
      await this.renderFile({ targetFile, templateFile });
      if (fileName !== '.gitkeep') {
        await this.helper.removeGitkeep(parentPath);
      }
    }
    return files;
  }

  replaceTemplate(content, scope) {
    if (!content) return null;
    return content.toString().replace(/(\\)?\{\{ *([\w.]+) *\}\}/g, (block, skip, key) => {
      if (skip) {
        return block.substring(skip.length);
      }
      const value = this.getProperty(scope, key);
      return value !== undefined ? value : '';
    });
  }

  getProperty(obj, name, sep?) {
    return this._getProperty(obj, name, sep, false);
  }

  _getProperty(obj, name, sep, forceObject) {
    if (!obj) return undefined;
    const names = name.split(sep || '.');
    // loop
    for (const name of names) {
      if (obj[name] === undefined || obj[name] === null) {
        if (forceObject) {
          obj[name] = {};
        } else {
          obj = obj[name];
          break;
        }
      }
      obj = obj[name];
    }
    return obj;
  }

  parseFileBaseName(basename) {
    let fileName = this.fileMapping[basename] || basename;
    if (fileName.lastIndexOf('_') === fileName.length - 1) {
      fileName = fileName.substring(0, fileName.length - 1);
    }
    return fileName;
  }

  async renderFile({ targetFile, templateFile }: any) {
    const stats = fs.lstatSync(templateFile);
    if (stats.isSymbolicLink()) {
      const target = fs.readlinkSync(templateFile);
      fs.symlinkSync(target, targetFile);
      await this.console.log(`${targetFile} link to ${target}`);
    } else if (stats.isDirectory()) {
      await this.helper.ensureDir(targetFile);
    } else if (stats.isFile()) {
      const content = fs.readFileSync(templateFile);
      await this.console.log(`write to ${targetFile}`);
      // check if content is a text file
      let result;
      let changed;
      if (!isTextOrBinary.isTextSync(templateFile, content)) {
        result = content;
      } else {
        const _content = content.toString('utf8');
        result = await this.renderContent({ content: _content });
        changed = _content !== result;
      }
      // save
      fs.writeFileSync(targetFile, result);
      // format
      if (changed && !this.context.argv.noformat) {
        await catchError(() => {
          return this.helper.formatFile({ fileName: targetFile, logPrefix: 'format: ' });
        });
      }
    } else {
      await this.console.log(`ignore ${templateFile}, only support file, dir, symlink`);
    }
  }

  async renderContent({ content }: any) {
    if (!content) return content;
    const data = this.getEjsData();
    const options = this.getEjsOptions();
    return await ejs.render(content, data, options);
  }

  getEjsOptions() {
    return {
      async: true,
      cache: false,
      compileDebug: true,
      outputFunctionName: 'echo',
      rmWhitespace: false,
    };
  }

  getEjsData(): IEjsData {
    return {
      cli: this.cli,
      ...this.context,
    };
  }

  getAstData(ast, snippet) {
    return {
      cli: this.cli,
      ast,
      snippet,
      ...this.context,
    };
  }

  getInitData(targetFile: string) {
    return {
      cli: this.cli,
      targetFile,
      ...this.context,
    };
  }

  async applySnippets(targetDir: string, snippetsDir: string) {
    // snippets
    let files = await globby('*.{cjs,js,ts}', {
      cwd: snippetsDir,
      onlyFiles: true,
    });
    // snippets sort
    files = files
      .filter(item => item[0] !== '-')
      .sort((a, b) => this._parseSnippetFilePrefix(a) - this._parseSnippetFilePrefix(b));
    // for
    for (const file of files) {
      const snippetTemplatePath = path.join(snippetsDir, file);
      await this._loadSnippetInstance(snippetTemplatePath, async snippet => {
        if (!snippet.file) {
          throw new Error(`should provider file path for: ${file}`);
        }
        let fileName;
        if (typeof snippet.file === 'function') {
          fileName = snippet.file(this.getEjsData());
        } else {
          fileName = await this.renderContent({ content: snippet.file });
        }
        if (!fileName) {
          // means ignore, so do nothing
        } else {
          const targetFile = path.join(targetDir, fileName);
          await this.applySnippet(targetFile, snippet);
        }
      });
    }
  }

  async _loadSnippetInstance(
    snippetTemplatePath: string,
    fn: (snippet: ISnippet) => Promise<void>,
  ) {
    return await this.helper.importDynamic(snippetTemplatePath, instance => {
      return fn(instance.default);
    });
  }

  async applySnippet(targetFile: string, snippet: ISnippet) {
    await this.console.log(`apply changes to ${targetFile}`);
    // source code
    let sourceCode;
    if (fs.existsSync(targetFile)) {
      sourceCode = fs.readFileSync(targetFile);
      sourceCode = sourceCode.toString('utf8');
    } else {
      if (!snippet.init) {
        throw new Error(`should provider init content for: ${targetFile}`);
      }
      let content;
      if (typeof snippet.init === 'function') {
        content = await snippet.init(this.getInitData(targetFile));
      } else {
        content = snippet.init;
      }
      sourceCode = await this.renderContent({ content });
    }
    // language
    const language = snippet.language as TypeParseLanguage;
    // transform
    let outputCode;
    if (language === 'plain') {
      const ast = sourceCode;
      const outAst = await snippet.transform(this.getAstData(ast, snippet));
      outputCode = outAst;
    } else if (language === 'json') {
      const ast = JSON.parse(sourceCode);
      const outAst = await snippet.transform(this.getAstData(ast, snippet));
      outputCode = outAst === undefined ? outAst : JSON.stringify(outAst, null, 2);
    } else {
      const ast = gogocode(sourceCode, { parseOptions: snippet.parseOptions });
      const outAst = await snippet.transform(this.getAstData(ast, snippet));
      outputCode = outAst === undefined ? outAst : outAst.root().generate();
    }
    if (outputCode !== undefined) {
      // save
      fs.writeFileSync(targetFile, outputCode);
      // format
      if (snippet.format || !this.context.argv.noformat) {
        await catchError(() => {
          return this.helper.formatFile({ fileName: targetFile, logPrefix: 'format: ' });
        });
      }
    }
  }

  _parseSnippetFilePrefix(fileName) {
    const num = fileName.split('-')[0];
    if (!num || Number.isNaN(Number(num))) return 10000;
    return Number(num);
  }
}
