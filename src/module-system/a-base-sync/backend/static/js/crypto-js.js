require.config({
  paths: {
    'crypto-js': 'api/static/a/base/vendor/crypto-js/crypto-js',
  },
});
define(['crypto-js'], function (CryptoJS) {
  return CryptoJS;
});
