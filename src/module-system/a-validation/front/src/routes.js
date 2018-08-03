function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'validate', component: load('validate') },
];
