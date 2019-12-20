// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // account
  config.account = {};

  // account.public
  config.account.public = {
    appID: '',
    appSecret: '',
    token: '',
    encodingAESKey: '',
  };

  return config;
};
