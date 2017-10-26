function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'welcome/:who', component: load('welcome') },
  { path: 'profile', component: load('profile'), meta: { requiresAuth: true } },
];
