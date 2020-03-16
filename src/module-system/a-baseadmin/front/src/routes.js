function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'role/list', component: load('role/list') },
  { path: 'role/edit', component: load('role/edit') },
  { path: 'role/select', component: load('role/select') },
  { path: 'user/list', component: load('user/list') },
  { path: 'user/view', component: load('user/view') },
  { path: 'user/search', component: load('user/search') },
  { path: 'user/rights', component: load('user/rights') },
  { path: 'atomRight/list', component: load('atomRight/list') },
  { path: 'atomRight/edit', component: load('atomRight/edit') },
  { path: 'atomRight/add', component: load('atomRight/add') },
  { path: 'menuRight/list', component: load('menuRight/list') },
  { path: 'functionRight/types', component: load('functionRight/types') },
  { path: 'functionRight/list', component: load('functionRight/list') },
  { path: 'functionRight/edit', component: load('functionRight/edit') },
  { path: 'functionRight/add', component: load('functionRight/add') },
  { path: 'auth/list', component: load('auth/list') },
  { path: 'auth/edit', component: load('auth/edit') },
  { path: 'settings/list', component: load('settings/list') },
  { path: 'function/scene', component: load('settings/functionScene') },
  { path: 'function/sceneItem', component: load('settings/functionSceneItem') },
];
