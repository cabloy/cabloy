function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'config/list', component: load('config/list') },
  { path: 'config/site', component: load('config/site') },
  { path: 'config/siteBase', component: load('config/siteBase') },
  { path: 'config/language', component: load('config/language') },
  { path: 'config/languagePreview', component: load('config/languagePreview') },
  { path: 'article/contentEdit', component: load('article/contentEdit') },
  { path: 'article/post', component: load('article/post') },
  { path: 'block/list', component: load('block/list') },
  { path: 'block/item', component: load('block/item') },
];
