function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'config/list', component: load('config/list') },
  { path: 'config/site', component: load('config/site') },
  { path: 'config/siteBase', component: load('config/siteBase') },
  { path: 'config/language', component: load('config/language') },
  { path: 'config/languagePreview', component: load('config/languagePreview') },
];
