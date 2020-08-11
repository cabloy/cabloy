const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const env = config.build.env;

let plugins = [
  new webpack.DefinePlugin({
    'process.env': env,
  }),
  new VueLoaderPlugin(),
  // new MiniCssExtractPlugin({
  //   filename: utils.assetsPath('css/[name].[contenthash].css'),
  // }),
  // new OptimizeCssAssetsPlugin({
  //   cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
  // }),
  // generate dist index.html with correct asset hash for caching.
  // you can customize output by editing /index.html
  // see https://github.com/ampedandwired/html-webpack-plugin
  new HtmlWebpackPlugin({
    filename: config.build.index,
    template: utils.getIndexPath(),
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    title: config.build.title,
  }),
  new webpack.HashedModuleIdsPlugin(),
  // Banner
  new webpack.BannerPlugin({
    banner: 'Powered by CabloyJS!',
    entryOnly: true,
  }),
];

if (config.build.plugins) {
  plugins = plugins.concat(config.build.plugins);
}

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          config.projectPath,
        ],
        exclude: [
          /\.min\.js$/,
          resolve('build/__runtime/modules/'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  useBuiltIns: false,
                },
              ],
            ],
            plugins: [ '@babel/plugin-syntax-dynamic-import' ],
          },
        },
      },
      ...utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: false,
      }) ],
  },
  devtool: config.build.productionSourceMap ? 'source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    // ecmaVersion: 5,
  },
  plugins,
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0, // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimize: config.build.uglify,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        chunkFilter: chunk => {
          if (!chunk._modules) return true;
          for (const module of chunk._modules.values()) {
            if (module.resource && (module.resource.indexOf('.min.js') > -1 || module.resource.indexOf('/build/__runtime/modules/') > -1)) {
              return false;
            }
          }
          return true;
        },
      }),
    ],
  },
});

module.exports = webpackConfig;
