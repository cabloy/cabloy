module.exports = [
  // captcha
  { method: 'post', path: 'captcha/createProviderInstance', controller: 'captcha' },
  { method: 'post', path: 'captcha/refreshProviderInstance', controller: 'captcha' },
];
