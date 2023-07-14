const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fse = require('fs-extra');
const mglob = require('egg-born-mglob');

module.exports = context => {
  return {
    assetsPath(_path) {
      const assetsSubDirectory =
        process.env.NODE_ENV === 'production'
          ? context.config.build.assetsSubDirectory
          : context.config.dev.assetsSubDirectory;
      return path.posix.join(assetsSubDirectory, _path);
    },
    cssLoaders(options) {
      options = options || {};

      const cssLoader = {
        loader: 'css-loader',
        options: {
          sourceMap: options.sourceMap,
          esModule: false,
        },
      };

      // generate loader string to be used with extract text plugin
      function generateLoaders(loader, loaderOptions) {
        const loaders = [cssLoader];
        if (loader) {
          loaders.push({
            loader: loader + '-loader',
            options: Object.assign({}, loaderOptions, {
              sourceMap: options.sourceMap,
            }),
          });
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        // if (options.extract) {
        //   return [ MiniCssExtractPlugin.loader ].concat(loaders);
        // }
        const vueStyleLoader = {
          loader: 'vue-style-loader',
          options: {
            isGlobal: true,
          },
        };
        return [vueStyleLoader].concat(loaders);
      }

      // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
      return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less', { lessOptions: { javascriptEnabled: true } }),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus'),
      };
    },
    // Generate loaders for standalone style files (outside of .vue)
    styleLoaders(options) {
      const output = [];
      const loaders = this.cssLoaders(options);
      for (const extension in loaders) {
        const loader = loaders[extension];
        output.push({
          test: new RegExp('\\.' + extension + '$'),
          use: loader,
        });
      }
      return output;
    },
    copyModules() {
      // runtime path
      const runtimePath = path.join(context.config.frontPath, '__runtime');
      // static path
      // const staticPath = path.join(context.config.build.assetsRoot, context.config.build.assetsSubDirectory);

      // modules
      const { modules, modulesGlobal } = mglob.glob({
        projectPath: context.config.projectPath,
        disabledModules: context.config.configProject.base.disabledModules,
        disabledSuites: context.config.configProject.base.disabledSuites,
        log: true,
        type: 'front',
      });

      // clear
      fse.emptyDirSync(runtimePath);
      fse.emptyDirSync(path.join(runtimePath, 'modules'));

      // global modules
      const __terserPluginExcludes = [];
      let jsImportStatic = '';
      for (const relativeName in modulesGlobal) {
        const module = modules[relativeName];
        // terser
        __terserPluginExcludes.push(new RegExp(`static[\\/]js[\\/]${relativeName}`));
        // copy js
        let fileDest = path.join(runtimePath, 'modules', relativeName, 'dist/front.js');
        fse.copySync(module.js.front, fileDest);
        module.js.front = fileDest;
        // copy js.map
        let fileSrc = `${module.root}/dist/front.js.map`;
        fileDest = path.join(runtimePath, 'modules', relativeName, 'dist/front.js.map');
        if (fse.existsSync(fileSrc)) fse.copySync(fileSrc, fileDest);
        // copy static
        fileSrc = `${module.root}/dist/static`;
        fileDest = path.join(runtimePath, 'modules', relativeName, 'dist/static');
        if (fse.existsSync(fileSrc)) fse.copySync(fileSrc, fileDest);
        // require context
        if (fse.existsSync(fileSrc)) {
          // fse.copySync(fileSrc, staticPath);
          const fileSrcStatic = fileSrc.replace(/\\/g, '/');
          jsImportStatic += `\nimportStatic(require.context('${fileSrcStatic}'));\n`;
        }
      }
      context.config.build.__terserPluginExcludes = __terserPluginExcludes;

      // require/import
      let jsModules = '';
      let jsModulesMonkey = '';
      let jsModulesSync = '';
      for (const relativeName in modules) {
        const module = modules[relativeName];
        // jsFront
        if (!module.js.front) {
          throw new Error(`module.js.front not found: ${relativeName}`);
        }
        const jsFront = module.js.front.replace(/\\/g, '/');
        // js
        if (module.info.monkey || module.info.sync) {
          jsModules += `
modules['${relativeName}'] = {
   instance: require('${jsFront}'),
   info: ${JSON.stringify(module.info)},
};
`;
        } else {
          jsModules += `
modules['${relativeName}'] = {
   instance: () => import(/* webpackChunkName: "${relativeName}" */ '${jsFront}'),
   info: ${JSON.stringify(module.info)},
};
`;
        }
        // js monkeys
        // js syncs
        if (module.info.monkey) {
          jsModulesMonkey += `modulesMonkey['${relativeName}'] = true;\n`;
        } else if (module.info.sync) {
          jsModulesSync += `modulesSync['${relativeName}'] = true;\n`;
        }
      }

      // save to modules.js
      const modulesJS = `
function importStatic(r) {
  r.keys().forEach(r);
}      
${jsImportStatic}      
const modules = {};
const modulesSync = {};
const modulesMonkey = {};
${jsModules}
${jsModulesSync}
${jsModulesMonkey}
export default {
  modules,
  modulesSync,
  modulesMonkey,
};
`;

      fse.outputFileSync(path.join(runtimePath, 'modules.js'), modulesJS);

      // favicon
      const favicon = this.getIndexPath('favicon.ico');
      fse.copySync(favicon, path.join(context.config.build.assetsRoot, 'favicon.ico'));
    },
    getIndexPath(filename) {
      filename = filename || 'index.ejs';
      const index = path.join(context.config.projectPath, 'src/front/', filename);
      if (fse.existsSync(index)) return index;
      return path.join(__dirname, '../', filename);
    },
    babelLoaderOptions() {
      const pluginsExclude =
        process.env.NODE_ENV === 'production'
          ? []
          : ['@babel/plugin-transform-regenerator', '@babel/plugin-proposal-async-generator-functions'];
      return {
        babelrc: false,
        presets: [
          '@vue/babel-preset-jsx',
          [
            '@babel/preset-env',
            {
              modules: false,
              useBuiltIns: false,
              exclude: pluginsExclude,
            },
          ],
        ],
        plugins: ['@babel/plugin-syntax-dynamic-import', 'jsx-v-model'],
      };
    },
  };
};
