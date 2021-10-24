const path = require('path');

module.exports = context => {
  const nodeModules = {
    require3: 'commonjs2 require3',
  };

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
                  node: '8',
                },
                include: [
                  '@babel/plugin-transform-for-of',
                  '@babel/plugin-transform-parameters',
                  '@babel/plugin-transform-shorthand-properties',
                  '@babel/plugin-transform-spread',
                  '@babel/plugin-transform-template-literals',
                  '@babel/plugin-proposal-object-rest-spread',
                ],
              },
            ],
          ],
          // plugins: [
          //   '@babel/plugin-transform-arrow-functions',
          //   '@babel/plugin-transform-for-of',
          //   '@babel/plugin-transform-parameters',
          //   '@babel/plugin-transform-shorthand-properties',
          //   '@babel/plugin-transform-spread',
          //   '@babel/plugin-transform-template-literals',
          //   '@babel/plugin-proposal-object-rest-spread',
          //   // atom.party.js: Unable to handle nested super.prop usage (This is an error on an internal node. Probably an internal error.)
          //   '@babel/plugin-transform-async-to-generator',
          // ],
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
    externals: nodeModules,
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
