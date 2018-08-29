function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'config/list', component: load('config/list') },
  { path: 'config/site', component: load('config/site') },
  { path: 'config/language', component: load('config/language') },
];
