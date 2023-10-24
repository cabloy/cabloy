function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  //
  { path: 'formActionBulk', component: loadjsx('formActionBulk') },
];
