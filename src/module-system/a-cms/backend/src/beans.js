const versionManager = require('./bean/version.manager.js');
const localBuild = require('./bean/local.build.js');
const queueRender = require('./bean/queue.render.js');
const startupRegisterAllWatchers = require('./bean/startup.registerAllWatchers.js');
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
    // atom
    'atom.article': {
      mode: 'app',
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
