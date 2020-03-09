function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'dashboard', component: load('dashboard') },
  { path: 'dashboard/settings', component: load('dashboardSettings') },
  { path: 'widget/add', component: load('widgetAdd') },
  { path: 'widget/properties', component: load('widgetProperties') },
];
