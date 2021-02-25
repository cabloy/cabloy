function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'group', component: loadjsx('message/group') },
  { path: 'list', component: loadjsx('message/list') },
];
