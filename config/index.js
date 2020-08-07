// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path');
const merge = require('webpack-merge');
const yargs = require('yargs');
const config = require('../../../build/config.js');

// proxyTarget
const proxyTarget = config.front.dev.proxyBaseURL || `http://${config.backend.hostname}:${config.backend.port}`;

// scene
const argv = yargs(process.argv).argv;
const sceneValue = argv.scene || 'web';

const envScene = {
  build: {
    env: {
      SCENE: JSON.stringify(sceneValue),
    },
  },
  dev: {
    env: {
      SCENE: JSON.stringify(sceneValue),
    },
  },
};

// dist
const distPath = path.resolve(__dirname, `../dist${sceneValue ? '/' + sceneValue : ''}`);

// merge
module.exports = merge({
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
      '/favicon.ico': {
        target: proxyTarget,
        xfwd: true,
      },
      '/api': {
        target: proxyTarget,
        xfwd: true,
      },
      '/public': {
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
}, envScene, config.front);
