module.exports = app => {
  const routes = [
    // base
    { method: 'post', path: 'base/modules', controller: 'base' },
    { method: 'post', path: 'base/locales', controller: 'base' },
    { method: 'post', path: 'base/resourceTypes', controller: 'base' },
    { method: 'post', path: 'base/getAtomClassBase', controller: 'base' },
    { method: 'post', path: 'base/atomClasses', controller: 'base' },
    { method: 'post', path: 'base/actions', controller: 'base' },
    { method: 'get', path: 'base/qrcode', controller: 'base', meta: { auth: { enable: false } } },
    { method: 'post', path: 'base/themes', controller: 'base' },
    // atom
    { method: 'post', path: 'atom/preferredRoles', controller: 'atom' },
    { method: 'post', path: 'atom/preferredRole', controller: 'atom' },
    { method: 'post', path: 'atom/preferredRoleId', controller: 'atom' },
    {
      method: 'post',
      path: 'atom/create',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'create' } },
    },
    { method: 'post', path: 'atom/atomClass', controller: 'atom', meta: { right: { type: 'atom', action: 'read' } } },
    { method: 'post', path: 'atom/read', controller: 'atom', meta: { right: { type: 'atom', action: 'read' } } },
    { method: 'post', path: 'atom/select', controller: 'atom', meta: { right: { type: 'atom', action: 'select' } } },
    { method: 'post', path: 'atom/count', controller: 'atom', meta: { right: { type: 'atom', action: 'select' } } },
    {
      method: 'post',
      path: 'atom/write',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'write', stage: 'draft' } },
    },
    {
      method: 'post',
      path: 'atom/openDraft',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'write' } },
    },
    {
      method: 'post',
      path: 'atom/submit',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'write', stage: 'draft' } },
    },
    {
      method: 'post',
      path: 'atom/writeSubmit',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'write', stage: 'draft' } },
    },
    {
      method: 'post',
      path: 'atom/delete',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'delete' } },
    },
    {
      method: 'post',
      path: 'atom/clone',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'clone' } },
    },
    {
      method: 'post',
      path: 'atom/enable',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'enable' } },
    },
    {
      method: 'post',
      path: 'atom/disable',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'disable' } },
    },
    {
      method: 'post',
      path: 'atom/deleteBulk',
      controller: 'atom',
      middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 'deleteBulk' } },
    },
    {
      method: 'post',
      path: 'atom/exportBulk',
      controller: 'atom',
      meta: { right: { type: 'atom', action: 'exportBulk' } },
    },
    {
      method: 'post',
      path: 'atom/importBulk',
      controller: 'atom',
      meta: { right: { type: 'atom', action: 'importBulk' } },
    },
    {
      method: 'post',
      path: 'atom/star',
      controller: 'atom',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 'read' },
      },
    },
    {
      method: 'post',
      path: 'atom/readCount',
      controller: 'atom',
      meta: { right: { type: 'atom', action: 'read', checkFlow: true } },
    },
    { method: 'post', path: 'atom/stats', controller: 'atom' },
    {
      method: 'post',
      path: 'atom/labels',
      controller: 'atom',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 'read' },
      },
    },
    { method: 'post', path: 'atom/actions', controller: 'atom' },
    { method: 'post', path: 'atom/actionsBulk', controller: 'atom' },
    { method: 'post', path: 'atom/schema', controller: 'atom' },
    { method: 'post', path: 'atom/validator', controller: 'atom' },
    { method: 'post', path: 'atom/checkRightAction', controller: 'atom' },
    // comment
    { method: 'post', path: 'comment/all', controller: 'comment' },
    {
      method: 'post',
      path: 'comment/list',
      controller: 'comment',
      meta: { right: { type: 'atom', action: 'read', checkFlow: true } },
    },
    {
      method: 'post',
      path: 'comment/count',
      controller: 'comment',
      meta: { right: { type: 'atom', action: 'read', checkFlow: true } },
    },
    {
      method: 'post',
      path: 'comment/item',
      controller: 'comment',
      meta: { right: { type: 'atom', action: 'read', checkFlow: true } },
    },
    {
      method: 'post',
      path: 'comment/save',
      controller: 'comment',
      middlewares: 'transaction',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 'read', checkFlow: true },
      },
    },
    {
      method: 'post',
      path: 'comment/delete',
      controller: 'comment',
      middlewares: 'transaction',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 'read', checkFlow: true },
      },
    },
    {
      method: 'post',
      path: 'comment/heart',
      controller: 'comment',
      middlewares: 'transaction',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 'read', checkFlow: true },
      },
    },
    // user
    { method: 'post', path: 'user/getLabels', controller: 'user' },
    { method: 'post', path: 'user/setLabels', controller: 'user' },
    // resource
    { method: 'post', path: 'resource/select', controller: 'resource' },
    { method: 'post', path: 'resource/read', controller: 'resource' },
    { method: 'post', path: 'resource/check', controller: 'resource' },
    {
      method: 'post',
      path: 'resource/resourceRoles',
      controller: 'resource',
      meta: { right: { type: 'atom', action: 'authorize' } },
    },
    {
      method: 'post',
      path: 'resource/resourceRoleRemove',
      controller: 'resource',
      meta: { right: { type: 'atom', action: 'authorize' } },
    },
    {
      method: 'post',
      path: 'resource/resourceRoleAdd',
      controller: 'resource',
      meta: { right: { type: 'atom', action: 'authorize' } },
    },
    // atomClass
    { method: 'post', path: 'atomClass/validatorSearch', controller: 'atomClass' },
    { method: 'post', path: 'atomClass/checkRightCreate', controller: 'atomClass' },
    { method: 'post', path: 'atomClass/atomClass', controller: 'atomClass' },
    { method: 'post', path: 'atomClass/atomClassesUser', controller: 'atomClass' },
    { method: 'post', path: 'atomClass/actionsUser', controller: 'atomClass' },
    // auth
    { method: 'post', path: 'auth/echo', controller: 'auth', meta: { auth: { enable: false } } },
    { method: 'post', path: 'auth/check', controller: 'auth', meta: { auth: { user: true } } },
    {
      method: 'post',
      path: 'auth/logout',
      controller: 'auth',
      meta: {
        auth: { enable: true },
        right: { enableAuthOpen: true },
      },
    },
    // cors
    { method: 'options', path: /.*/ },
    // jwt
    { method: 'post', path: 'jwt/create', controller: 'jwt' },
    // util
    {
      method: 'get',
      path: 'util/performAction',
      controller: 'util',
      middlewares: 'jsonp',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'util/performActions', controller: 'util' },
    // layoutConfig
    { method: 'post', path: 'layoutConfig/load', controller: 'layoutConfig' },
    { method: 'post', path: 'layoutConfig/save', controller: 'layoutConfig' },
    { method: 'post', path: 'layoutConfig/saveKey', controller: 'layoutConfig' },
    // category
    { method: 'post', path: 'category/child', controller: 'category' }, // not set function right
    { method: 'post', path: 'category/children', controller: 'category' }, // not set function right
    {
      method: 'post',
      path: 'category/add',
      controller: 'category',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'category/delete',
      controller: 'category',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'category/move',
      controller: 'category',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'category/item',
      controller: 'category',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'category/save',
      controller: 'category',
      middlewares: 'validate',
      meta: {
        validate: { module: 'a-base', validator: 'category' },
        right: { type: 'resource', module: 'a-settings', name: 'settings' },
      },
    },
    { method: 'post', path: 'category/tree', controller: 'category' }, // not set function right
    { method: 'post', path: 'category/relativeTop', controller: 'category' }, // not set function right
    { method: 'post', path: 'category/parseCategoryName', controller: 'category' }, // not set function right
    // tag
    { method: 'post', path: 'tag/list', controller: 'tag' },
    {
      method: 'post',
      path: 'tag/add',
      controller: 'tag',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'tag/save',
      controller: 'tag',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    {
      method: 'post',
      path: 'tag/delete',
      controller: 'tag',
      meta: { right: { type: 'resource', module: 'a-settings', name: 'settings' } },
    },
    // db
    { method: 'post', path: 'db/insert', controller: 'db', middlewares: 'test' },
    { method: 'post', path: 'db/select', controller: 'db', middlewares: 'test' },
    { method: 'post', path: 'db/get', controller: 'db', middlewares: 'test' },
    { method: 'post', path: 'db/count', controller: 'db', middlewares: 'test' },
    { method: 'post', path: 'db/update', controller: 'db', middlewares: 'test' },
    { method: 'post', path: 'db/delete', controller: 'db', middlewares: 'test' },
    { method: 'post', path: 'db/query', controller: 'db', middlewares: 'test' },
    { method: 'post', path: 'db/queryOne', controller: 'db', middlewares: 'test' },
    { method: 'post', path: 'db/iid', controller: 'db', middlewares: 'test' },
  ];
  return routes;
};
