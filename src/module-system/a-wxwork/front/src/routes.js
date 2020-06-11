function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'settings/list', component: load('settings/list') },
  { path: 'settings/contacts', component: load('settings/contacts') },
];
