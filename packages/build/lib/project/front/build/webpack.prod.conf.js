const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfigFn = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = context => {
  // plugins
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
      title: context.config.configProject.base.title,
    }),
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
          include: [context.config.projectPath],
          exclude: [/\.min\.js$/, /__runtime[\\\/]modules/],
          use: {
            loader: 'babel-loader',
            options: context.utils.babelLoaderOptions(),
          },
        },
        ...context.utils.styleLoaders({
          sourceMap: context.config.build.productionSourceMap,
          extract: false,
        }),
      ],
    },
    devtool: context.config.build.productionSourceMap ? 'source-map' : false,
    output: {
      path: context.config.build.assetsRoot,
      filename: context.utils.assetsPath('js/[name].[chunkhash].js'),
      chunkFilename: context.utils.assetsPath('js/[name].[chunkhash].js'),
      // ecmaVersion: 5,
    },
    plugins,
    optimization: {
      runtimeChunk: false,
      splitChunks: (context.config.build.optimization && context.config.build.optimization.splitChunks) || {
        chunks: 'initial',
        maxInitialRequests: 20,
        maxInitialSize: 800000,
        cacheGroups: {
          default: false,
        },
      },
      minimize: context.config.build.uglify,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          exclude: context.config.build.__terserPluginExcludes,
          // chunkFilter: chunk => {
          //   if (!chunk._modules) return true;
          //   for (const module of chunk._modules.values()) {
          //     if (module.resource && (module.resource.indexOf('.min.js') > -1 || module.resource.indexOf('/__runtime/modules/') > -1)) {
          //       return false;
          //     }
          //   }
          //   return true;
          // },
        }),
      ],
    },
  });

  return webpackConfig;
};
