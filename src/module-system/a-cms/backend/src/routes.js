const version = require('./controller/version.js');
const article = require('./controller/article.js');
const category = require('./controller/category.js');
const render = require('./controller/render.js');
const site = require('./controller/site.js');
const tag = require('./controller/tag.js');
const comment = require('./controller/comment.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // article
    { method: 'post', path: 'article/create', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/read', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/select', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/write', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/delete', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/action', controller: article, middlewares: 'inner' },
    { method: 'post', path: 'article/enable', controller: article, middlewares: 'inner' },
    { method: 'get', path: 'article/list', controller: article, middlewares: 'jsonp' },
    { method: 'get', path: 'article/attachments', controller: article, middlewares: 'jsonp' },
    // comment
    { method: 'get', path: 'comment/all', controller: comment, action: 'allP', middlewares: 'jsonp' },
    // render
    { method: 'post', path: 'render/renderArticle', controller: render, middlewares: 'inner,file' },
    { method: 'post', path: 'render/deleteArticle', controller: render, middlewares: 'inner,file' },
    { method: 'post', path: 'render/getArticleUrl', controller: render,
      meta: { right: { type: 'atom', action: 2 } },
    },
    // site
    { method: 'post', path: 'site/getConfigSiteBase', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigSite', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigSite', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguagePreview', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getConfigLanguage', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/setConfigLanguage', controller: site, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguage', controller: site, middlewares: 'file', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/buildLanguages', controller: site, middlewares: 'file', meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'site/getLanguages', controller: site },
    { method: 'post', path: 'site/getUrl', controller: site },
    // category
    { method: 'post', path: 'category/item', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/save', controller: category, middlewares: 'validate', meta: {
      validate: { validator: 'category' },
      right: { type: 'function', module: 'a-settings', name: 'settings' },
    } },
    { method: 'post', path: 'category/children', controller: category }, // not set function right
    { method: 'post', path: 'category/add', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/delete', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    { method: 'post', path: 'category/move', controller: category, meta: { right: { type: 'function', module: 'a-settings', name: 'settings' } } },
    // tag
    { method: 'post', path: 'tag/list', controller: tag },

  ];
  return routes;
};
