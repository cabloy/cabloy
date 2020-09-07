const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfigFn = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = context => {

  function resolve(dir) {
    return path.join(__dirname, '..', dir);
  }

  const env = context.config.build.env;

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
      filename: context.config.build.index,
      template: context.utils.getIndexPath(),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
      },
      title: context.config.build.title,
    }),
    new webpack.HashedModuleIdsPlugin(),
    // Banner
    new webpack.BannerPlugin({
      banner: 'Powered by CabloyJS!',
      entryOnly: true,
    }),
  ];

  if (context.config.build.plugins) {
    plugins = plugins.concat(context.config.build.plugins);
  }

  const webpackConfig = merge(baseWebpackConfigFn(context), {
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            context.config.projectPath,
          ],
          exclude: [
            /\.min\.js$/,
            path.join(context.config.frontPath, '__runtime/modules/'),
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
        ...context.utils.styleLoaders({
          sourceMap: context.config.build.productionSourceMap,
          extract: false,
        }) ],
    },
    devtool: context.config.build.productionSourceMap ? 'source-map' : false,
    output: {
      path: context.config.build.assetsRoot,
      filename: context.utils.assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: context.utils.assetsPath('js/[id].[chunkhash].js'),
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
      minimize: context.config.build.uglify,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          chunkFilter: chunk => {
            if (!chunk._modules) return true;
            for (const module of chunk._modules.values()) {
              if (module.resource && (module.resource.indexOf('.min.js') > -1 || module.resource.indexOf('/__runtime/modules/') > -1)) {
                return false;
              }
            }
            return true;
          },
        }),
      ],
    },
  });

  return webpackConfig;
};
