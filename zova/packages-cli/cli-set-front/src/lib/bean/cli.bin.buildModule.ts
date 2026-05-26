import type { OutputOptions, RolldownBuild, RolldownOptions } from 'rolldown';
import type { UserConfig } from 'vite';

import { BeanCliBase } from '@cabloy/cli';
import babelPlugin from '@cabloy/vite-plugin-babel';
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';
import path from 'node:path';
import { rimraf } from 'rimraf';
import { rolldown } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';
import { build } from 'vite';

import { getAbsolutePathOfModule } from '../utils.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    minify: boolean;
    sourcemap: boolean;
    dts: boolean;
  }
}

export class CliBinBuildModule extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    await this._vite(projectPath);
  }

  async _vite(projectPath: string) {
    const { argv } = this.context;
    await rimraf(path.join(projectPath, 'dist'));
    await this._buildSrc(projectPath);
    if (argv.dts) {
      await this._buildDts(projectPath);
    }
  }

  async _buildDts(projectPath: string) {
    const { argv } = this.context;

    const sourceMap = argv.sourcemap;

    const inputOptions: RolldownOptions = {
      input: 'src/index.ts',
      plugins: [
        dts({
          tsconfig: 'tsconfig.build.json',
          emitDtsOnly: true,
        }),
      ],
      external: id => {
        return !id.startsWith('.') && !path.isAbsolute(id);
      },
    };

    const outputOption: OutputOptions = {
      dir: path.join(projectPath, 'dist'),
      format: 'esm',
      sourcemap: sourceMap,
    };

    let bundle: RolldownBuild | undefined;
    try {
      bundle = await rolldown(inputOptions);
      await bundle.write(outputOption);
    } finally {
      if (bundle) {
        // closes the bundle
        await bundle.close();
      }
    }
  }

  async _buildSrc(_projectPath: string) {
    const { argv } = this.context;

    const sourceMap = argv.sourcemap;
    const minify = argv.minify;

    const babelPluginZovaComponent = getAbsolutePathOfModule('babel-plugin-zova-component', '');
    const babelPluginZovaBehavior = getAbsolutePathOfModule('babel-plugin-zova-behavior', '');
    const babelPluginZovaBeanModule = getAbsolutePathOfModule('babel-plugin-zova-bean-module', '');
    const babelPluginZovaBeanUse = getAbsolutePathOfModule('babel-plugin-zova-bean-use', '');
    const babelPluginTransformTypescriptMetadata = getAbsolutePathOfModule('babel-plugin-transform-typescript-metadata', '');
    const babelPluginProposalDecorators = getAbsolutePathOfModule('@babel/plugin-proposal-decorators', '');
    const babelPluginTransformClassProperties = getAbsolutePathOfModule('@babel/plugin-transform-class-properties', '');
    const babelPluginTransformTypescript = getAbsolutePathOfModule('@babel/plugin-transform-typescript', '');

    const plugins = [
      babelPlugin({
        filter: /\.ts$/,
        babelConfig: {
          babelrc: false,
          configFile: false,
          plugins: [
            [babelPluginZovaBeanModule, { brandName: 'zova' }],
            [babelPluginZovaBeanUse],
            [babelPluginTransformTypescriptMetadata],
            [babelPluginProposalDecorators, { version: 'legacy' }],
            [babelPluginTransformClassProperties, { loose: true }],
            [babelPluginTransformTypescript],
          ],
        },
      }),
      vueJsxPlugin({
        include: /\.[jt]sx$/,
        babelPlugins: [
          [babelPluginZovaComponent],
          [babelPluginZovaBehavior],
          [babelPluginZovaBeanModule, { brandName: 'zova' }],
          [babelPluginZovaBeanUse],
          [babelPluginTransformTypescriptMetadata],
          [babelPluginProposalDecorators, { version: 'legacy' }],
          [babelPluginTransformClassProperties, { loose: true }],
        ],
      }),
    ];

    const viteConfig: UserConfig = {
      plugins,
      build: {
        lib: {
          entry: 'src/index.ts',
          formats: ['es'],
          fileName: 'index',
        },
        rolldownOptions: {
          external: id => {
            if (id.includes('/assets/')) return true;
            return !id.startsWith('.') && !path.isAbsolute(id);
          },
        },
        sourcemap: sourceMap,
        // keep_classnames not take effect for 'oxc'
        minify: minify ? 'terser' : false,
        terserOptions: {
          keep_classnames: true,
        },
      },
    };
    await build(viteConfig);
  }
}
