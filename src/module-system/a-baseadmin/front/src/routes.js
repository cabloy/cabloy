function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'role/select', component: load('role/select') },
  { path: 'role/roleUsers', component: loadjsx('role/roleUsers') },
  { path: 'role/includes', component: loadjsx('role/includes') },
  { path: 'user/select', component: load('user/select') },
  { path: 'user/userRoles', component: loadjsx('user/userRoles') },
  { path: 'resourceRight/add', component: load('resourceRight/add') },
  { path: 'auth/list', component: loadjsx('auth/list') },
  { path: 'auth/config', component: loadjsx('auth/config') },
  { path: 'category/management', component: loadjsx('category/management') },
  { path: 'category/tree', component: loadjsx('category/tree') },
  { path: 'category/edit', component: load('category/edit') },
  { path: 'tag/management', component: loadjsx('tag/management') },
  { path: 'tag/list', component: load('tag/list') },
  { path: 'fields/fieldsRight', component: loadjsx('fields/fieldsRight') },
  // bak
  // { path: 'atomRight/edit', component: loadjsx('atomRight/edit') },
  // { path: 'atomRight/add', component: loadjsx('atomRight/add') },
  // { path: 'user/atomRights', component: loadjsx('user/atomRights') },
  // { path: 'user/resourceRights', component: loadjsx('user/resourceRights') },
];
