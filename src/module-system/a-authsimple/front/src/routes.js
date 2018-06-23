function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'signup', component: load('signup') },
  { path: 'reset', component: load('reset') },
];
