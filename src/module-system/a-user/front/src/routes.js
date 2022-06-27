function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'user/mine', component: loadjsx('user/appMine') },
  { path: 'user/mineAgent', component: load('user/mineAgent') },
  { path: 'user/edit', component: load('user/edit') },
  { path: 'user/agent', component: load('user/agent') },
  { path: 'user/authentications', component: loadjsx('user/authentications') },
  { path: 'user/appearance', component: load('user/appearance') },
  { path: 'user/exports', component: load('user/exports') },
  { path: 'user/alert', component: loadjsx('user/alert') },
  { path: 'theme', component: load('theme/theme') },
  { path: 'theme/builtIn', component: load('theme/builtIn') },
  { path: 'view/pc', component: loadjsx('view/viewpc') },
  { path: 'view/mobile', component: loadjsx('view/viewmobile') },
  { path: 'public/profile', component: load('public/profile') },
];
