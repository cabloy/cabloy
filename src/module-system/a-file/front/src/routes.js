function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'upload', component: load('upload') },
  { path: 'test', component: load('test') },
];
