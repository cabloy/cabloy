function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: ':scene/list', component: load('list') },
  { path: ':scene/edit', component: load('edit') },
];
