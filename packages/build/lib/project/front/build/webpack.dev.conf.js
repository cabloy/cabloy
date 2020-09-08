const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfigFn = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = context => {
  const baseWebpackConfig = baseWebpackConfigFn(context);

  // add hot-reload related code to entry chunks
  Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = [ path.join(__dirname, 'dev-client') ].concat(baseWebpackConfig.entry[name]);
  });

  return merge(baseWebpackConfig, {
    mode: 'development',
    module: {
      rules: context.utils.styleLoaders({
        sourceMap: context.config.dev.cssSourceMap,
      }),
    },
    devtool: 'cheap-module-source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env': context.config.dev.env,
      }),
      new VueLoaderPlugin(),
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: context.utils.getIndexPath(),
        inject: true,
        title: context.config.dev.title,
      }),
      new FriendlyErrorsPlugin(),
    ],
    watchOptions: {
      aggregateTimeout: 1000,
      ignored: [ /\/backend\/cms\//, /\/backend\/test\//, /\/src\/module\/.*?\/build\//, /\/src\/module\/.*?\/dist\//, /\/\.git\// ],
    },
  });
};
