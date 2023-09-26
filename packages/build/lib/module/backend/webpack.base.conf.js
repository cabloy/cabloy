const path = require('path');

module.exports = context => {
  function nodeModulesCheck(_context_, request, callback) {
    if (path.isAbsolute(request)) return callback();
    if (request[0] === '.') return callback();
    const externalsExclude = context.config.build.externalsExclude;
    if (externalsExclude && externalsExclude[request]) {
      return callback();
    }
    return callback(null, `commonjs2 ${request}`);
  }

  const rules = [];
  if (context.config.build.uglify) {
    rules.push({
      test: /\.js$/,
      exclude: [/node_modules/, /\.spec\.js/],
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  node: '12',
                },
                include: [
                  '@babel/plugin-transform-for-of',
                  '@babel/plugin-transform-parameters',
                  '@babel/plugin-transform-shorthand-properties',
                  '@babel/plugin-transform-spread',
                  '@babel/plugin-transform-template-literals',
                  '@babel/plugin-proposal-object-rest-spread',
                  '@babel/plugin-transform-destructuring',
                  '@babel/plugin-transform-async-to-generator',
                  '@babel/plugin-transform-regenerator',
                ],
              },
            ],
          ],
        },
      },
    });
  }

  return {
    entry: {
      backend: path.join(context.modulePath, 'backend/src/main.js'),
    },
    target: 'node',
    output: {
      path: context.config.build.assetsRoot,
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    externals: [nodeModulesCheck],
    resolve: {
      extensions: ['.js', '.json'],
    },
    module: {
      rules,
    },
    node: {
      global: false,
      __filename: false,
      __dirname: false,
    },
  };
};
