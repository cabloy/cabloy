import type {
  LogLevel,
  LogOrStringHandler,
  OutputOptions,
  RollupBuild,
  RollupLog,
  RollupOptions,
} from 'rollup';

import { BeanCliBase } from '@cabloy/cli';
import aliasImport from '@rollup/plugin-alias';
import babelImport from '@rollup/plugin-babel';
import commonjsImport from '@rollup/plugin-commonjs';
import jsonImport from '@rollup/plugin-json';
import resolveImport from '@rollup/plugin-node-resolve';
import terserImport from '@rollup/plugin-terser';
import typescriptImport from '@rollup/plugin-typescript';
import path from 'node:path';
import { rimraf } from 'rimraf';
import { rollup } from 'rollup';

import { getAbsolutePathOfModule } from '../utils.ts';

const commonjs = commonjsImport as any as typeof commonjsImport.default;
const typescript = typescriptImport as any as typeof typescriptImport.default;
const resolve = resolveImport as any as typeof resolveImport.default;
// const swc = swcImport as any as typeof swcImport.default;
const json = jsonImport as any as typeof jsonImport.default;
const babel = babelImport as any as typeof babelImport.default;
const terser = terserImport as any as typeof terserImport.default;
const alias = aliasImport as any as typeof aliasImport.default;

declare module '@cabloy/cli' {
  interface ICommandArgv {
    minify: boolean;
    sourcemap: boolean;
  }
}

export class CliBinBuildModule extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    await this._build(projectPath);
  }

  async _build(projectPath: string) {
    await rimraf(path.join(projectPath, 'dist'));
    await this._rollup(projectPath);
  }

  async _rollup(projectPath: string) {
    const { argv } = this.context;
    const aliasEntries: aliasImport.Alias[] = [];
    for (const name of [
      'better-sqlite3',
      'mysql',
      'oracledb',
      'pg-native',
      'pg-query-stream',
      'sqlite3',
      'tedious',
      'cloudflare:sockets',
    ]) {
      aliasEntries.push({ find: name, replacement: 'vona-shared' });
    }

    const sourceMap = argv.sourcemap;

    const babelPluginVonaBeanModule = getAbsolutePathOfModule('babel-plugin-vona-bean-module', '');
    const babelPluginTransformTypescriptMetadata = getAbsolutePathOfModule(
      'babel-plugin-transform-typescript-metadata',
      '',
    );
    const babelPluginProposalDecorators = getAbsolutePathOfModule(
      '@babel/plugin-proposal-decorators',
      '',
    );
    const babelPluginTransformClassProperties = getAbsolutePathOfModule(
      '@babel/plugin-transform-class-properties',
      '',
    );
    const babelPluginTransformTypescript = getAbsolutePathOfModule(
      '@babel/plugin-transform-typescript',
      '',
    );

    const plugins = [
      alias({
        entries: aliasEntries,
      }),
      resolve({
        preferBuiltins: true,
      }),
      json(),
      commonjs(),
      typescript({
        module: 'nodenext',
        compilerOptions: {
          noCheck: true,
          declaration: false,
          composite: false,
          sourceMap,
        },
        outputToFilesystem: false,
      }),
      babel({
        include: '**/*.ts(x)?',
        extensions: ['.ts', '.tsx'],
        babelHelpers: 'bundled',
        skipPreflightCheck: true,
        babelrc: false,
        configFile: false,
        plugins: [
          [babelPluginVonaBeanModule, { brandName: 'vona' }],
          [babelPluginTransformTypescriptMetadata],
          [babelPluginProposalDecorators, { version: 'legacy' }],
          [babelPluginTransformClassProperties, { loose: true }],
          [babelPluginTransformTypescript],
        ],
      }),
    ];
    if (argv.minify) {
      plugins.push(
        terser({
          keep_classnames: true,
        }),
      );
    }
    const inputOptions: RollupOptions = {
      input: path.join(projectPath, 'src/index.ts'),
      plugins,
      onLog: (level: LogLevel, log: RollupLog, defaultHandler: LogOrStringHandler) => {
        if (log.code === 'CIRCULAR_DEPENDENCY') return;
        if (
          log.code === 'THIS_IS_UNDEFINED' &&
          (log.message.includes('ramda/es/partialObject.js') ||
            log.message.includes(
              "The 'this' keyword is equivalent to 'undefined' at the top level of an ES module",
            ))
        ) {
          return;
        }
        if (log.code === 'EVAL' && log.message.includes('depd/index.js')) return;
        if (log.code === 'EVAL' && log.message.includes('bluebird/js/release/util.js')) return;
        defaultHandler(level, log);
      },
      external(source, _importer, _isResolved) {
        if (source.includes('/src/') || source.startsWith('.')) return false;
        return true;
      },
    };

    const outputOption: OutputOptions = {
      dir: path.join(projectPath, 'dist'),
      // file: path.join(projectPath, 'dist/index.js'),
      format: 'esm',
      sourcemap: sourceMap,
      // https://github.com/rollup/rollup/issues/4166
      inlineDynamicImports: true,
    };

    let bundle: RollupBuild | undefined;
    try {
      bundle = await rollup(inputOptions);
      await bundle.write(outputOption);
    } finally {
      if (bundle) {
        // closes the bundle
        await bundle.close();
      }
    }
  }
}
