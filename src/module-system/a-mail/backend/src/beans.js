const versionManager = require('./bean/version.manager.js');
const ioMessageMail = require('./bean/io.message.mail.js');
const ioChannelMail = require('./bean/io.channel.mail.js');
const beanMail = require('./bean/bean.mail.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // io
    'io.message.mail': {
      mode: 'ctx',
      bean: ioMessageMail,
    },
    'io.channel.mail': {
      mode: 'ctx',
      bean: ioChannelMail,
    },
    // global
    mail: {
      mode: 'ctx',
      bean: beanMail,
      global: true,
    },
  };
  return beans;
};
