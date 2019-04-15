function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'signup', component: load('signup') },
  { path: 'passwordChange', component: load('passwordChange') },
  { path: 'passwordFind', component: load('passwordFind') },
  { path: 'passwordReset', component: load('passwordReset') },
  { path: 'emailConfirm', component: load('emailConfirm') },
];
