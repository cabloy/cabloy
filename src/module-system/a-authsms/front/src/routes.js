function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'signup', component: load('signup') },
  { path: 'mobileVerify', component: load('mobileVerify') },
  { path: 'smsProvider/list', component: loadjsx('smsProvider/list') },
  { path: 'smsProvider/config', component: loadjsx('smsProvider/config') },
];
