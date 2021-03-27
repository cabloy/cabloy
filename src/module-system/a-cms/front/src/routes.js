function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'config/atomClasses', component: load('config/atomClasses') },
  { path: 'config/list', component: load('config/list') },
  { path: 'config/site', component: load('config/site') },
  { path: 'config/siteBase', component: load('config/siteBase') },
  { path: 'config/language', component: load('config/language') },
  { path: 'config/languagePreview', component: load('config/languagePreview') },
  { path: 'article/contentEdit', component: load('article/contentEdit') },
  { path: 'article/post', component: load('article/post') },
  { path: 'article/edit', component: load('article/edit') },
  { path: 'block/edit', component: load('block/blockEdit') },
];
