module.exports = [
  // article
  { method: 'post', path: 'article/list', controller: 'article' },
  { method: 'post', path: 'article/attachments', controller: 'article' },
  // comment
  { method: 'post', path: 'comment/all', controller: 'comment' },
  // render
  {
    method: 'post',
    path: 'render/getArticleUrl',
    controller: 'render',
    meta: { right: { type: 'atom', action: 'read', checkFlow: true } },
  },
  // site
  {
    method: 'post',
    path: 'site/getConfigSiteBase',
    controller: 'site',
    meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
  },
  {
    method: 'post',
    path: 'site/getConfigSite',
    controller: 'site',
    meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
  },
  {
    method: 'post',
    path: 'site/setConfigSite',
    controller: 'site',
    meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
  },
  {
    method: 'post',
    path: 'site/getConfigLanguagePreview',
    controller: 'site',
    meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
  },
  {
    method: 'post',
    path: 'site/getConfigLanguage',
    controller: 'site',
    meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
  },
  {
    method: 'post',
    path: 'site/setConfigLanguage',
    controller: 'site',
    meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
  },
  {
    method: 'post',
    path: 'site/buildLanguage',
    controller: 'site',
    meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
  },
  {
    method: 'post',
    path: 'site/buildLanguages',
    controller: 'site',
    meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
  },
  { method: 'post', path: 'site/getLanguages', controller: 'site' },
  { method: 'post', path: 'site/getUrl', controller: 'site' },
  {
    method: 'post',
    path: 'site/getStats',
    controller: 'site',
    meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
  },
  // rss
  { method: 'get', path: 'rss/feed/article/comments/:atomId', controller: 'rss', action: 'articleComments' },
  {
    method: 'get',
    path: 'rss/feed/comments/:module/:atomClassName/:language',
    controller: 'rss',
    action: 'feedComments',
  },
  { method: 'get', path: 'rss/feed/:module/:atomClassName/:language', controller: 'rss', action: 'feed' },
  // site
  { method: 'post', path: 'site/checkFile', controller: 'site' },
];
