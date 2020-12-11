function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'user/mine', component: load('user/mineOp') },
  { path: 'user/mineAgent', component: load('user/mineAgent') },
  { path: 'user/edit', component: load('user/edit') },
  { path: 'user/agent', component: load('user/agent') },
  { path: 'user/functions', component: load('user/functions') },
  { path: 'user/account', component: load('user/account') },
  { path: 'user/authentications', component: load('user/authentications') },
  { path: 'user/exports', component: load('user/exports') },
  { path: 'theme', component: load('theme/theme') },
  { path: 'theme/builtIn', component: load('theme/builtIn') },
  { path: 'view', component: loadjsx('view/view') },
  { path: 'my/atoms', component: load('my/atoms') },
  { path: 'public/profile', component: load('public/profile') },
];
