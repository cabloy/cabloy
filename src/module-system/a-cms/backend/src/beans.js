const versionManager = require('./bean/version.manager.js');
const localBuild = require('./bean/local.build.js');
const localRender = require('./bean/local.render.js');
const localSite = require('./bean/local.site.js');
const queueRender = require('./bean/queue.render.js');
const startupRegisterAllWatchers = require('./bean/startup.registerAllWatchers.js');
const startupRegisterDevelopment = require('./bean/startup.registerDevelopment.js');
const atomArticle = require('./bean/atom.article.js');
const beanCms = require('./bean/bean.cms.js');
const ioMessageHotloadFile = require('./bean/io.message.hotloadFile.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // local
    'local.build': {
      bean: localBuild,
    },
    'local.render': {
      bean: localRender,
    },
    'local.site': {
      bean: localSite,
    },
    // queue
    'queue.render': {
      bean: queueRender,
    },
    // startup
    'startup.registerAllWatchers': {
      bean: startupRegisterAllWatchers,
    },
    'startup.registerDevelopment': {
      bean: startupRegisterDevelopment,
    },
    // atom
    'atom.article': {
      bean: atomArticle,
    },
    // global
    cms: {
      bean: beanCms,
      global: true,
    },
    // io
    'io.message.hotloadFile': {
      bean: ioMessageHotloadFile,
    },
  };
  return beans;
};
