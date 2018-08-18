function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'file/upload', component: load('file/upload') },
  { path: 'file/test', component: load('file/test') },
];
