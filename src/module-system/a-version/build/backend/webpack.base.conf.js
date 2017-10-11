const path = require('path');
// const fs = require('fs');
const config = require('./config.js');

const nodeModules = {
  require3: 'commonjs2 require3',
};
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return [ '.bin' ].indexOf(x) === -1;
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs2 ' + mod;
//   });

function resolve(dir) {
  return path.join(__dirname, '../../backend', dir);
}

module.exports = {
  entry: {
    backend: resolve('src/main.js'),
  },
  target: 'node',
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    library: 'backend',
    libraryTarget: 'commonjs2',
  },
  externals: nodeModules,
  resolve: {
    extensions: [ '.js', '.json' ],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [],
  },
};
