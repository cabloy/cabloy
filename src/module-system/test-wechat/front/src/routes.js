function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'test/index', component: load('test/index') },
];
