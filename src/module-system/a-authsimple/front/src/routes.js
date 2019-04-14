function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'signup', component: load('signup') },
  { path: 'passwordChange', component: load('passwordChange') },
  { path: 'emailConfirm', component: load('emailConfirm') },
];
