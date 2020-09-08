const path = require('path');

module.exports = context => {

  const nodeModules = {
    require3: 'commonjs2 require3',
  };

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
      rules: [],
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

