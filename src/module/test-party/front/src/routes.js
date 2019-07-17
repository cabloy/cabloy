function load(name) {
  return require(`./pages/${name}.vue`).default;
}

function loadKitchenSink(name) {
  return require(`./kitchen-sink/pages/${name}.vue`).default;
}

export default [
  { path: 'test/select', component: load('test/select') },
  { path: 'kitchen-sink/index', component: loadKitchenSink('index') },
  { path: 'kitchen-sink/fileUpload', component: loadKitchenSink('fileUpload') },
  { path: 'kitchen-sink/progress', component: loadKitchenSink('progress') },
  { path: 'kitchen-sink/settings', component: loadKitchenSink('settings') },
  { path: 'kitchen-sink/view/sizeTarget', component: loadKitchenSink('view/sizeTarget') },
  { path: 'kitchen-sink/view/sizeSmall', component: loadKitchenSink('view/sizeSmall') },
  { path: 'kitchen-sink/view/sizeMiddle', component: loadKitchenSink('view/sizeMiddle') },
  { path: 'kitchen-sink/view/sizeLarge', component: loadKitchenSink('view/sizeLarge') },
  { path: 'kitchen-sink/page/openReturn', component: loadKitchenSink('page/openReturn') },
  { path: 'kitchen-sink/page/pageReturn', component: loadKitchenSink('page/pageReturn') },
  { path: 'kitchen-sink/box', component: loadKitchenSink('box') },
  { path: 'kitchen-sink/markdownEditor', component: loadKitchenSink('markdownEditor') },
  { path: 'kitchen-sink/dialog', component: loadKitchenSink('dialog') },
];
