function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'test/select', component: load('test/select') },
];
