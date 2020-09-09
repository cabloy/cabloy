module.exports = app => {
  let routes = [
    // version
    { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
    // article
    { method: 'post', path: 'article/create', controller: 'article', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/read', controller: 'article', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/select', controller: 'article', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/write', controller: 'article', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/delete', controller: 'article', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/action', controller: 'article', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/enable', controller: 'article', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'article/list', controller: 'article' },
    { method: 'post', path: 'article/attachments', controller: 'article' },
    // comment
    { method: 'post', path: 'comment/all', controller: 'comment' },
    // render
    { method: 'post', path: 'render/getArticleUrl', controller: 'render',
      meta: { right: { type: 'atom', action: 2 } },
    },
    // site
    { method: 'post', path: 'site/getSite', controller: 'site', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'site/getConfigSiteBase', controller: 'site', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigSite', controller: 'site', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigSite', controller: 'site', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguagePreview', controller: 'site', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguage', controller: 'site', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigLanguage', controller: 'site', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguage', controller: 'site', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguages', controller: 'site', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getLanguages', controller: 'site' },
    { method: 'post', path: 'site/getUrl', controller: 'site' },
    { method: 'post', path: 'site/getBlocks', controller: 'site' },
    { method: 'post', path: 'site/getBlockArray', controller: 'site' },
    { method: 'post', path: 'site/blockSave', controller: 'site' },
    { method: 'post', path: 'site/registerAllWatchersStartup', controller: 'site', middlewares: 'inner', meta: { auth: { enable: false } } },
    { method: 'post', path: 'site/getStats', controller: 'site', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    // category
    { method: 'post', path: 'category/item', controller: 'category', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/save', controller: 'category', middlewares: 'validate', meta: {
      validate: { validator: 'category' },
      right: { type: 'function', module: 'a-settings', name: 'settings' },
    } },
    { method: 'post', path: 'category/tree', controller: 'category' }, // not set function right
    { method: 'post', path: 'category/children', controller: 'category' }, // not set function right
    { method: 'post', path: 'category/add', controller: 'category', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/delete', controller: 'category', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/move', controller: 'category', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/relativeTop', controller: 'category' }, // not set function right
    // tag
    { method: 'post', path: 'tag/list', controller: 'tag' },
    { method: 'post', path: 'tag/add', controller: 'tag', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'tag/save', controller: 'tag', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'tag/delete', controller: 'tag', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    // rss
    { method: 'get', path: 'rss/feed/article/comments/:atomId', controller: 'rss', action: 'articleComments' },
    { method: 'get', path: 'rss/feed/comments/:module/:atomClassName/:language', controller: 'rss', action: 'feedComments' },
    { method: 'get', path: 'rss/feed/:module/:atomClassName/:language', controller: 'rss', action: 'feed' },
  ];
  if (app.meta.isTest || app.meta.isLocal) {
    routes = routes.concat([
    ]);
  }
  return routes;
};
