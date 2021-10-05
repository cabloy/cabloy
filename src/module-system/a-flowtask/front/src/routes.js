function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'flow', component: loadjsx('flow') },
  { path: 'flow/list', component: loadjsx('flowList') },
  { path: 'flowTask/list', component: loadjsx('flowTaskList') },
  { path: 'flowTaskAtom', component: loadjsx('flowTaskAtom') },
  { path: 'flowTask/tabs', component: load('flowTaskTabs') },
  { path: 'flow/tabs', component: load('flowTabs') },
  { path: 'flowTaskAction/assigneesConfirmation', component: loadjsx('flowTaskAction/assigneesConfirmation') },
  { path: 'flowTaskAction/forward', component: loadjsx('flowTaskAction/forward') },
  { path: 'flowTaskAction/substitute', component: loadjsx('flowTaskAction/substitute') },
];
