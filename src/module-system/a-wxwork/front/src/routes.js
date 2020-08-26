function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'contacts/management', component: load('contacts/management') },
  { path: 'contacts/sync', component: load('contacts/sync') },
];
