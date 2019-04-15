function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'signup', component: load('signup') },
  { path: 'passwordChange', component: load('passwordChange') },
  { path: 'passwordForgot', component: load('passwordForgot') },
  { path: 'passwordReset', component: load('passwordReset') },
  { path: 'emailConfirm', component: load('emailConfirm') },
];
