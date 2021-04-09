function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'flowDef/contentEdit', component: load('flowDef/contentEdit') },
  { path: 'flowDef/nodes', component: load('flowDef/nodes') },
];
