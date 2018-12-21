module.exports = {

  static: true,

  view: false,

  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

  passport: {
    enable: true,
    package: 'egg-passport',
  },

  proxyagent: {
    enable: true,
    package: 'egg-development-proxyagent',
  },

};
