const path = require('path');

module.exports = context => {

  const nodeModules = {
    require3: 'commonjs2 require3',
  };

  const rules = [];
  if (context.config.build.uglify) {
    rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          // presets: [ '@babel/preset-env' ],
          plugins: [
            '@babel/plugin-transform-arrow-functions',
            '@babel/plugin-transform-for-of',
            '@babel/plugin-transform-parameters',
            '@babel/plugin-transform-shorthand-properties',
            '@babel/plugin-transform-spread',
            '@babel/plugin-transform-template-literals',
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-transform-async-to-generator',
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
      library: 'backend',
      libraryTarget: 'commonjs2',
    },
    externals: nodeModules,
    resolve: {
      extensions: [ '.js', '.json' ],
    },
    module: {
      rules,
    },
    node: {
      console: false,
      global: false,
      process: false,
      __filename: false,
      __dirname: false,
      Buffer: false,
      setImmediate: false,
    },
  };
};

