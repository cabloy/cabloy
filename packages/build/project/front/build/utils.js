const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fse = require('fs-extra');
const chalk = require('chalk');
const mglob = require('egg-born-mglob');

module.exports = context => {
  return {
    assetsPath(_path) {
      const assetsSubDirectory = process.env.NODE_ENV === 'production'
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
        const loaders = [ cssLoader ];
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
        return [ 'vue-style-loader' ].concat(loaders);
      }

      // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
      return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
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
      const modulesLocal = {};
      const modulesGlobal = {};
      const modulesMonkey = {};

      const runtimePath = path.join(context.config.frontPath, '__runtime');

      // modules
      const modules = mglob.glob();


      // clear
      fse.emptyDirSync(runtimePath);
      fse.emptyDirSync(path.join(runtimePath, 'modules'));

      // global modules
      for (const relativeName in modules) {
        const module = modules[relativeName];
        if (!module.info.public) continue;
        // copy js
        let fileSrc = `${module.root}/dist/front.js`;
        let fileDest = path.join(runtimePath, 'modules', relativeName, 'dist/front.js');
        fse.copySync(fileSrc, fileDest);
        // copy static
        fileSrc = `${module.root}/dist/static`;
        fileDest = path.join(context.config.build.assetsRoot, context.config.build.assetsSubDirectory);
        if (fse.existsSync(fileSrc)) fse.copySync(fileSrc, fileDest);
        fileDest = path.join(runtimePath, 'modules', relativeName, 'dist/static');
        if (fse.existsSync(fileSrc)) fse.copySync(fileSrc, fileDest);
      }

      // require/import
      let jsModules = '';
      let jsModulesMonkey = '';
      let jsModulesSync = '';
      for (const relativeName in modules) {
        const module = modules[relativeName];
        // log
        if (module.info.monkey) {
          modulesMonkey[relativeName] = module;
        } else if (module.info.public) {
          modulesGlobal[relativeName] = module;
        } else {
          modulesLocal[relativeName] = module;
        }
        // js
        if (module.info.monkey || module.info.sync) {
          jsModules +=
`
modules['${relativeName}'] = {
   instance: require('${module.js.front}'),
   info: ${JSON.stringify(module.info)},
}
`;
        } else {
          jsModules +=
`
modules['${relativeName}'] = {
   instance: () => import('${module.js.front}'),
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
      const modulesJS =
`
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

      // log
      console.log('\n');
      console.log(chalk.yellow('\n=== Local Modules ==='));
      for (const key in modulesLocal) {
        console.log(chalk.cyan('> ' + key));
      }
      console.log(chalk.yellow('\n=== Global Modules ==='));
      for (const key in modulesGlobal) {
        console.log(chalk.cyan('> ' + key));
      }
      console.log(chalk.yellow('\n=== Monkey Modules ==='));
      for (const key in modulesMonkey) {
        console.log(chalk.cyan('> ' + key));
      }
      console.log('\n');
    },
    getIndexPath() {
      const index = path.join(context.config.projectPath, 'src/front/index.ejs');
      if (fse.existsSync(index)) return index;
      return path.join(__dirname, '../index.ejs');
    },
  };
};
