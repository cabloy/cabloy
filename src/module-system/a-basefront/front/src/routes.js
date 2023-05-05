function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'atom/list', component: loadjsx('atom/list') },
  { path: 'atom/searchQuick', component: loadjsx('atom/searchQuick') },
  { path: 'atom/labels', component: load('atom/labels') },
  { path: 'atom/item', component: loadjsx('atom/item') },
  { path: 'atom/select', component: loadjsx('atom/select') },
  { path: 'atom/selecting', component: loadjsx('atom/selecting') },
  { path: 'atom/autoStar', component: load('atom/autoStar'), meta: { auth: true } },
  { path: 'atom/starTabs', component: load('atom/starTabs') },
  { path: 'atom/draftTabs', component: load('atom/draftTabs') },
  { path: 'comment/list', component: load('comment/list') },
  { path: 'comment/item', component: load('comment/item'), meta: { auth: true } },
  { path: 'comment/all', component: load('comment/all') },
  { path: 'comment/autoHeart', component: load('comment/autoHeart'), meta: { auth: true } },
  { path: 'attachment/list', component: load('attachment/list') },
  { path: 'attachment/all', component: load('attachment/all') },
  { path: 'base/alert', component: load('base/alert') },
  { path: 'base/about', component: load('base/about') },
  { path: 'base/openLink', component: load('base/openLink') },
  { path: 'category/select', component: load('category/categorySelect') },
  { path: 'tag/select', component: load('tag/tagSelect') },
  { path: 'resource/authorize', component: load('resource/authorize') },
  { path: 'resource/select', component: load('resource/resourceSelect') },
];
