function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'section/clock/preferences', component: load('section/clockPreferences') },
];
