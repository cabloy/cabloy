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
      mode: 'app',
      bean: localBuild,
    },
    'local.render': {
      mode: 'ctx',
      bean: localRender,
    },
    'local.site': {
      mode: 'ctx',
      bean: localSite,
    },
    // queue
    'queue.render': {
      mode: 'app',
      bean: queueRender,
    },
    // startup
    'startup.registerAllWatchers': {
      mode: 'app',
      bean: startupRegisterAllWatchers,
    },
    'startup.registerDevelopment': {
      mode: 'app',
      bean: startupRegisterDevelopment,
    },
    // atom
    'atom.article': {
      mode: 'ctx',
      bean: atomArticle,
    },
    // global
    cms: {
      mode: 'ctx',
      bean: beanCms,
      global: true,
    },
    // io
    'io.message.hotloadFile': {
      mode: 'ctx',
      bean: ioMessageHotloadFile,
    },
  };
  return beans;
};
