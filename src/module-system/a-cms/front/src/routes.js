function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'config/list', component: load('config/list') },
  { path: 'config/site', component: load('config/site') },
  { path: 'config/siteBase', component: load('config/siteBase') },
  { path: 'config/language', component: load('config/language') },
  { path: 'config/languagePreview', component: load('config/languagePreview') },
  { path: 'category/list', component: load('category/list') },
  { path: 'category/edit', component: load('category/edit') },
  { path: 'category/select', component: load('category/select') },
  { path: 'article/contentEdit', component: load('article/contentEdit') },
  { path: 'article/category', component: load('article/category') },
  { path: 'article/list', component: load('article/list') },
  { path: 'tag/select', component: load('tag/select') },
  { path: 'block/list', component: load('block/list') },
  { path: 'block/item', component: load('block/item') },
];
