function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'flowDef/contentEdit', component: load('flowDef/contentEdit') },
];
