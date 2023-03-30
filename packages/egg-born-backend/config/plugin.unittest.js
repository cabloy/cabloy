module.exports = {
  view: false,

  static: {
    enable: true,
    package: 'egg-static',
  },

  mysql: {
    enable: true,
    package: '@zhennann/egg-mysql',
  },

  passport: {
    enable: true,
    package: '@zhennann/egg-passport',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },

  io: {
    enable: true,
    package: '@zhennann/egg-socket.io',
  },
};
