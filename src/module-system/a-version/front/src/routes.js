function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'check', component: load('check') },
];
