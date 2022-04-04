function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'role/select', component: load('role/select') },
  { path: 'role/includes', component: loadjsx('role/includes') },
  { path: 'user/list', component: load('user/list') },
  { path: 'user/view', component: load('user/view') },
  { path: 'user/search', component: load('user/search') },
  { path: 'user/select', component: load('user/select') },
  { path: 'user/rights', component: load('user/rights') },
  { path: 'atomRight/list', component: load('atomRight/list') },
  { path: 'atomRight/edit', component: load('atomRight/edit') },
  { path: 'atomRight/add', component: load('atomRight/add') },
  { path: 'resourceRight/list', component: load('resourceRight/list') },
  { path: 'resourceRight/edit', component: load('resourceRight/edit') },
  { path: 'resourceRight/add', component: load('resourceRight/add') },
  { path: 'auth/list', component: loadjsx('auth/list') },
  { path: 'auth/config', component: loadjsx('auth/config') },
  { path: 'settings/list', component: load('settings/list') },
  { path: 'category/management', component: loadjsx('category/management') },
  { path: 'category/tree', component: load('category/tree') },
  { path: 'category/edit', component: load('category/edit') },
  { path: 'tag/management', component: loadjsx('tag/management') },
  { path: 'tag/list', component: load('tag/list') },
];
