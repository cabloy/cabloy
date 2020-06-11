function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'settings/list', component: load('settings/list') },
  { path: 'contacts/management', component: load('contacts/management') },
  { path: 'contacts/sync', component: load('contacts/sync') },
];
