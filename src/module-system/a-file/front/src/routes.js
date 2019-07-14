function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [
  { path: 'file/upload', component: load('file/upload') },
];
