module.exports = {
  front: {
    productionSourceMap: false,
    uglify: true,
  },
  backend: {
    productionSourceMap: true,
    uglify: false,
    externalsExclude: {
      'password-hash-and-salt': 'commonjs2 password-hash-and-salt',
    },
  },
};
