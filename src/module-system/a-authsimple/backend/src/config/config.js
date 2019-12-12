// eslint-disable-next-line
module.exports = appInfo => {
  const config = {
  };

  // defaultPassword
  config.defaultPassword = '123456';

  // confirmation
  config.confirmation = {
    timeout: 2 * 24 * 60 * 60 * 1000, // 2 days
  };

  // passwordReset
  config.passwordReset = {
    timeout: 30 * 60 * 1000, // 30 minutes
  };

  // account
  config.account = {
    url: {
      emailConfirm: '/a/authsimple/emailConfirm',
      passwordChange: '/a/authsimple/passwordChange',
      passwordForgot: '/a/authsimple/passwordForgot',
      passwordReset: '/a/authsimple/passwordReset',
    },
  };

  return config;
};
