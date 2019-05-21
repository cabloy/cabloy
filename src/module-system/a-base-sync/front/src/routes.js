function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'menu/list', component: load('menu/list') },
  { path: 'menu/search', component: load('menu/search') },
  { path: 'menu/selectFunction', component: load('menu/selectFunction') },
  { path: 'atom/list', component: load('atom/list') },
  { path: 'atom/search', component: load('atom/search') },
  { path: 'atom/searchResult', component: load('atom/searchResult') },
  { path: 'atom/labels', component: load('atom/labels') },
  { path: 'atom/edit', component: load('atom/edit') },
  { path: 'atom/view', component: load('atom/view') },
  { path: 'atom/selectAtomClass', component: load('atom/selectAtomClass') },
  { path: 'atom/select', component: load('atom/select') },
  { path: 'atom/autoStar', component: load('atom/autoStar') },
  { path: 'comment/list', component: load('comment/list') },
  { path: 'comment/item', component: load('comment/item') },
  { path: 'comment/all', component: load('comment/all') },
  { path: 'comment/autoHeart', component: load('comment/autoHeart') },
  { path: 'attachment/list', component: load('attachment/list') },
  { path: 'base/alert', component: load('base/alert') },
];
