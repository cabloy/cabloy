const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfigFn = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = context => {
  const baseWebpackConfig = baseWebpackConfigFn(context);

  // add hot-reload related code to entry chunks
  Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = [path.join(__dirname, 'dev-client')].concat(baseWebpackConfig.entry[name]);
  });

  // plugins
  const env = context.config.dev.env;
  let plugins = [
    new webpack.DefinePlugin({
      'process.env': env,
    }),
    new VueLoaderPlugin(),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: context.utils.getIndexPath(),
      inject: true,
      title: context.config.configProject.base.title,
    }),
    // new FriendlyErrorsPlugin(),
  ];

  if (context.config.dev.plugins) {
    plugins = plugins.concat(context.config.dev.plugins);
  }

  return merge(baseWebpackConfig, {
    mode: 'development',
    module: {
      rules: context.utils.styleLoaders({
        sourceMap: context.config.dev.cssSourceMap,
      }),
    },
    devtool: 'cheap-module-source-map',
    plugins,
    optimization: {
      emitOnErrors: true,
    },
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: ['**/.git/**', '/node_modules/'],
      // ignored: [ '**/backend/cms/**', '**/backend/test/**', '**/src/module/*/dist/**', '**/.git/**' ],
    },
  });
};
