function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'user/mine', component: load('user/mine') },
  { path: 'user/edit', component: load('user/edit') },
  { path: 'user/agent', component: load('user/agent') },
  { path: 'user/functions', component: load('user/functions') },
  { path: 'user/account', component: load('user/account') },
];
