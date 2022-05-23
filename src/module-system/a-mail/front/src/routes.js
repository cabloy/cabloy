function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  //
  { path: 'scene/list', component: loadjsx('scene/list') },
  { path: 'scene/config', component: loadjsx('scene/config') },
];
