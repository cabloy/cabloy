const path = require('path');

module.exports = context => {
  const svg_pattern1 = /\/front\/src\/assets\/icons\/groups\/[^\/]+\.svg/;
  const svg_pattern2 = /\/icon\/[^\/]+\.svg/;
  const tools = {
    hasHash(file) {
      file = file.replace(/\\/g, '/');
      const name = path.basename(file);
      const parts = name.split('.');
      const partHash = parts[parts.length - 2];
      return partHash && partHash.length === 32;
    },
    combineHashFileName(file, dirname) {
      return this.hasHash(file)
        ? context.utils.assetsPath(`${dirname}/[name].[ext]`)
        : context.utils.assetsPath(`${dirname}/[name].[contenthash].[ext]`);
    },
    combineSvgFileName(file) {
      file = file.replace(/\\/g, '/');
      const match = file.match(svg_pattern1) || file.match(svg_pattern2);
      const dirname = match ? 'icon' : 'img';
      return this.combineHashFileName(file, dirname);
    },
    loaderRulesResource() {
      return [
        {
          test: /\.svg(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: false,
            esModule: false,
            name(file) {
              return tools.combineSvgFileName(file);
            },
            publicPath(url) {
              // '' means publicPath
              return '' + url;
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1000,
            name(file) {
              return tools.combineHashFileName(file, 'img');
            },
            esModule: false,
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 1000,
            name(file) {
              return tools.combineHashFileName(file, 'font');
            },
            esModule: false,
          },
        },
        {
          test: /\.(doc|docx|xlsx?|odt|pdf|mp3|wma|wav|iso|ppt|pptx|csv|apk|exe|rar|zip|tar\.gz)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: false,
            name(file) {
              return tools.combineHashFileName(file, 'file');
            },
            esModule: false,
          },
        },
        {
          test: /\.(wasm)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: false,
            name(file) {
              return tools.combineHashFileName(file, 'wasm');
            },
            esModule: false,
          },
        },
      ];
    },
  };
  return tools;
};
