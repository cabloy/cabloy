function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'flow', component: loadjsx('flow') },
  { path: 'flow/list', component: loadjsx('flowList') },
  { path: 'flowTaskAtom', component: loadjsx('flowTaskAtom') },
  { path: 'assigneesConfirmation', component: loadjsx('assigneesConfirmation') },
];
