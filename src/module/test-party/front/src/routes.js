function load(name) {
  return require(`./pages/${name}.vue`).default;
}

function loadKichenSink(name) {
  return require(`./kitchen-sink/pages/${name}.vue`).default;
}

export default [
  { path: 'test/select', component: load('test/select') },
  { path: 'kichen-sink/index', component: loadKichenSink('index') },
  { path: 'kichen-sink/fileUpload', component: loadKichenSink('fileUpload') },
  { path: 'kichen-sink/progress', component: loadKichenSink('progress') },
  { path: 'kichen-sink/settings', component: loadKichenSink('settings') },
];
