const open = require('open');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const fse = require('fs-extra');
const { createProxyMiddleware } = require('http-proxy-middleware');
const webpackConfigFn = require('./webpack.dev.conf');
const configFn = require('../config');
const utilsFn = require('./utils.js');

module.exports = ({ projectPath, frontPath, scene }) => {
  // context
  const context = {
    projectPath,
    frontPath,
    scene,
  };
  // utils
  context.utils = utilsFn(context);
  // config
  configFn(context, (err, config) => {
    context.config = config;

    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = JSON.parse(context.config.dev.env.NODE_ENV);
    }

    fse.removeSync(context.config.build.assetsRoot);
    fse.ensureDirSync(context.config.build.assetsRoot);

    context.utils.copyModules();

    // X: default hostname/port where dev server listens for incoming traffic
    const hostname = context.config.dev.hostname;
    const port = context.config.dev.port;
    // automatically open browser, if not set will be false
    const autoOpenBrowser = !!context.config.dev.autoOpenBrowser;
    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware
    const proxyTable = context.config.dev.proxyTable;

    const webpackConfig = webpackConfigFn(context);
    const app = express();
    const compiler = webpack(webpackConfig);

    const devMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
    });

    const hotMiddleware = require('webpack-hot-middleware')(compiler, {
      log: () => {},
    });
    // force page reload when html-webpack-plugin template changes
    // compiler.plugin('compilation', function(compilation) {
    //   compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
    //     hotMiddleware.publish({ action: 'reload' });
    //     cb();
    //   });
    // });
    compiler.hooks.compilation.tap('html-webpack-plugin-after-emit', () => {
      hotMiddleware.publish({ action: 'reload' });
    });

    // proxy api requests
    Object.keys(proxyTable).forEach(function (context) {
      let options = proxyTable[context];
      if (typeof options === 'string') {
        options = { target: options };
      }
      app.use(createProxyMiddleware(options.filter || context, options));
    });

    // handle fallback for HTML5 history API
    app.use(require('connect-history-api-fallback')());

    // serve webpack bundle output
    app.use(devMiddleware);

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(hotMiddleware);

    // serve pure static assets
    const staticPath = path.posix.join(context.config.dev.assetsPublicPath, context.config.dev.assetsSubDirectory);
    app.use(staticPath, express.static('./static'));
    // use modules static
    app.use(express.static(context.config.build.assetsRoot));

    const uri = `http://${hostname || 'localhost'}:${port}`;

    devMiddleware.waitUntilValid(function () {
      console.log('> Listening at ' + uri + '\n');
    });

    const listenOptions = { port };
    if (hostname) listenOptions.host = hostname;
    module.exports = app.listen(listenOptions, function (err) {
      if (err) {
        console.log(err);
        return;
      }

      // when env is testing, don't need open it
      if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        open(uri);
      }
    });
  });
};
