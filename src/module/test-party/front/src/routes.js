function load(name) {
  return require(`./pages/${name}.vue`).default;
}

function loadKitchenSink(name) {
  return require(`./kitchen-sink/pages/${name}.vue`).default;
}

function loadKitchenSinkFramework7(name) {
  return require(`./kitchen-sink/pages/framework7/${name}.vue`).default;
}

export default [
  { path: 'test/select', component: load('test/select') },
  { path: 'kitchen-sink/index', component: loadKitchenSink('index') },
  { path: 'kitchen-sink/about', component: loadKitchenSink('about') },
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
  { path: 'kitchen-sink/framework7/index', component: loadKitchenSinkFramework7('index') },
  { path: 'kitchen-sink/framework7/about', component: loadKitchenSinkFramework7('about') },
  { path: 'kitchen-sink/framework7/accordion', component: loadKitchenSinkFramework7('accordion') },
  { path: 'kitchen-sink/framework7/action-sheet', component: loadKitchenSinkFramework7('action-sheet') },
  { path: 'kitchen-sink/framework7/autocomplete', component: loadKitchenSinkFramework7('autocomplete') },
  { path: 'kitchen-sink/framework7/badge', component: loadKitchenSinkFramework7('badge') },
  { path: 'kitchen-sink/framework7/buttons', component: loadKitchenSinkFramework7('buttons') },
  { path: 'kitchen-sink/framework7/calendar', component: loadKitchenSinkFramework7('calendar') },
  { path: 'kitchen-sink/framework7/calendar-page', component: loadKitchenSinkFramework7('calendar-page') },
  { path: 'kitchen-sink/framework7/cards', component: loadKitchenSinkFramework7('cards') },
  { path: 'kitchen-sink/framework7/cards-expandable', component: loadKitchenSinkFramework7('cards-expandable') },
  { path: 'kitchen-sink/framework7/checkbox', component: loadKitchenSinkFramework7('checkbox') },
  { path: 'kitchen-sink/framework7/chips', component: loadKitchenSinkFramework7('chips') },
];
