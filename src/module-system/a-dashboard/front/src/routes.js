function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'dashboard', component: loadjsx('dashboard') },
  { path: 'dashboard/settings', component: load('dashboardSettings') },
  { path: 'widget/properties', component: load('widgetProperties') },
  { path: 'widget/property/edit', component: load('widgetPropertyEdit') },
  { path: 'widget/property/bind/add', component: load('widgetPropertyBindAdd') },
];
