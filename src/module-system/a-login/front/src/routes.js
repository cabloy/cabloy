function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'login', component: load('login') },
  { path: 'migrate', component: load('migrate'), meta: { auth: true } },
];
