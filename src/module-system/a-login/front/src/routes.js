function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'login', component: loadjsx('login') },
  { path: 'migrate', component: load('migrate'), meta: { auth: true } },
];
