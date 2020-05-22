module.exports = {

  static: false,

  view: false,

  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

  passport: {
    enable: true,
    package: 'egg-passport',
  },

  redis: {
    enable: true,
    package: 'egg-redis',
  },

  io: {
    enable: true,
    package: 'egg-socket.io',
  },

};
