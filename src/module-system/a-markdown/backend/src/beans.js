const versionManager = require('./bean/version.manager.js');
const beanMarkdown = require('./bean/bean.markdown.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // global
    markdown: {
      mode: 'ctx',
      bean: beanMarkdown,
      global: true,
    },
  };
  return beans;
};
