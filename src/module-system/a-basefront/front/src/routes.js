function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'menu/list', component: load('menu/list') },
  { path: 'menu/search', component: load('menu/search') },
  { path: 'menu/selectFunction', component: load('menu/selectFunction') },
  { path: 'atom/list', component: loadjsx('atom/list') },
  { path: 'atom/searchQuick', component: loadjsx('atom/searchQuick') },
  { path: 'atom/labels', component: load('atom/labels') },
  { path: 'atom/item', component: loadjsx('atom/item') },
  { path: 'atom/selectAtomClass', component: load('atom/selectAtomClass') },
  { path: 'atom/select', component: loadjsx('atom/select') },
  { path: 'atom/selecting', component: loadjsx('atom/selecting') },
  { path: 'atom/autoStar', component: load('atom/autoStar') },
  { path: 'comment/list', component: load('comment/list') },
  { path: 'comment/item', component: load('comment/item') },
  { path: 'comment/all', component: load('comment/all') },
  { path: 'comment/autoHeart', component: load('comment/autoHeart') },
  { path: 'attachment/list', component: load('attachment/list') },
  { path: 'base/alert', component: load('base/alert') },
  { path: 'base/about', component: load('base/about') },
  { path: 'category/select', component: load('category/select') },
  { path: 'tag/select', component: load('tag/select') },
];
