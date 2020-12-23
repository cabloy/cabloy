function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'instance/config', component: load('instance/config') },
];
