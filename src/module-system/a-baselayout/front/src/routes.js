function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'listLayoutFilter', component: load('listLayoutFilter') },
];
