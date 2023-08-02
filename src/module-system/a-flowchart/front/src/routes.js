function load(name) {
  return require(`./pages/${name}.vue`).default;
}
function loadjsx(name) {
  return require(`./pages/${name}.jsx`).default;
}

export default [
  { path: 'flowDef/assigneesEdit', component: loadjsx('flowDef/assigneesEdit') },
  { path: 'flowDef/behaviorEdit', component: loadjsx('flowDef/behaviorEdit') },
  { path: 'flowDef/behaviors', component: loadjsx('flowDef/behaviors') },
  { path: 'flowDef/contentEdit', component: load('flowDef/contentEdit') },
  { path: 'flowDef/contentProcessView', component: load('flowDef/contentProcessView') },
  { path: 'flowDef/nodes', component: loadjsx('flowDef/nodes') },
  { path: 'flowDef/nodeProperties', component: loadjsx('flowDef/nodeProperties') },
  { path: 'flowDef/schemaFields', component: loadjsx('flowDef/schemaFields') },
];
