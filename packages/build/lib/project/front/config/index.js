// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path');
const { merge } = require('webpack-merge');
const extend = require('@zhennann/extend');
const os = require('os');
const webpack = require('webpack');
const fse = require('fs-extra');
const chalk = require('chalk');

module.exports = (context, cb) => {
  // config
  const config = require(path.join(context.projectPath, 'build/config.js'));

  // proxyTarget
  const proxyTarget = config.front.dev.proxyBaseURL || `http://${config.backend.hostname}:${config.backend.port}`;

  // scene
  const sceneValue = context.scene || 'web';

  const envCustom = {
    build: {
      env: {
        SCENE: JSON.stringify(sceneValue),
        PROJECTPATH: JSON.stringify(context.projectPath),
        FRONTPATH: JSON.stringify(context.frontPath),
      },
    },
    dev: {
      env: {
        SCENE: JSON.stringify(sceneValue),
        PROJECTPATH: JSON.stringify(context.projectPath),
        FRONTPATH: JSON.stringify(context.frontPath),
      },
    },
  };

  // dist
  const distPath = path.join(context.projectPath, `src/front/__dist${sceneValue ? '/' + sceneValue : ''}`);

  // entry
  const entryDefault = path.join(context.projectPath, 'src/front/config/config.default.js');
  const entryScene = path.join(context.projectPath, `src/front/config/config.${sceneValue}.js`);
  if (!fse.existsSync(entryDefault)) {
    console.log(chalk.red('Please copy directory: from _config to config\n'));
    process.exit(0);
  }
  if (!fse.existsSync(entryScene)) {
    console.log(chalk.red(`  Scene Config File Not Found:\n  ${entryScene}\n`));
    process.exit(0);
  }

  // configProject
  const tmpdir = os.tmpdir();
  const files = {
    entry: {
      default: entryDefault,
      [sceneValue]: entryScene,
    },
    output: {
      path: tmpdir,
      filename: 'cabloy-front-config-[name].js',
      libraryTarget: 'commonjs2',
    },
  };
  webpack(files, err => {
    if (err) throw err;

    // name/title
    const pkgCabloy = require(path.join(context.projectPath, 'package.json'));
    const pkgName = pkgCabloy.name;
    const pkgTitle = pkgCabloy.title || pkgCabloy.name;

    const fileDefault = path.join(tmpdir, 'cabloy-front-config-default.js');
    const fileScene = path.join(tmpdir, `cabloy-front-config-${sceneValue}.js`);
    let configProject = require(fileDefault).default;
    const configScene = require(fileScene).default;
    configProject = extend(
      true,
      {
        base: {
          name: pkgName,
          title: pkgTitle,
        },
      },
      configProject,
      configScene
    );

    const envCustomTitle = {
      build: {
        env: {
          NAME: JSON.stringify(configProject.base.name),
          TITLE: JSON.stringify(configProject.base.title),
        },
      },
      dev: {
        env: {
          NAME: JSON.stringify(configProject.base.name),
          TITLE: JSON.stringify(configProject.base.title),
        },
      },
    };

    fse.removeSync(fileDefault);
    fse.removeSync(fileScene);

    // merge
    const res = merge(
      {
        projectPath: context.projectPath,
        frontPath: context.frontPath,
        configProject,
        pkgCabloy,
        build: {
          env: require('./prod.env'),
          index: path.resolve(distPath, 'index.html'),
          assetsRoot: distPath,
          assetsSubDirectory: 'static',
          assetsPublicPath: '',
          productionSourceMap: true,
          uglify: true,
        },
        dev: {
          env: require('./dev.env'),
          port: 9090,
          autoOpenBrowser: true,
          assetsSubDirectory: 'static',
          assetsPublicPath: '',
          proxyTable: {
            // '/favicon.ico': {
            //   target: proxyTarget,
            //   xfwd: true,
            // },
            '/api': {
              target: proxyTarget,
              xfwd: true,
            },
            '/socket.io': {
              target: proxyTarget,
              xfwd: true,
              ws: true,
            },
          },
          // CSS Sourcemaps off by default because relative paths are "buggy"
          // with this option, according to the CSS-Loader README
          // (https://github.com/webpack/css-loader#sourcemaps)
          // In our experience, they generally work as expected,
          // just be aware of this issue when enabling this option.
          cssSourceMap: false,
        },
      },
      envCustom,
      envCustomTitle,
      config.front
    );

    cb(null, res);
  });
};
