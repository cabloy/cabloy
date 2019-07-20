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
  { path: 'kitchen-sink/framework7/color-picker', component: loadKitchenSinkFramework7('color-picker') },
  { path: 'kitchen-sink/framework7/contacts-list', component: loadKitchenSinkFramework7('contacts-list') },
  { path: 'kitchen-sink/framework7/content-block', component: loadKitchenSinkFramework7('content-block') },
  { path: 'kitchen-sink/framework7/data-table', component: loadKitchenSinkFramework7('data-table') },
  { path: 'kitchen-sink/framework7/elevation', component: loadKitchenSinkFramework7('elevation') },
  { path: 'kitchen-sink/framework7/fab-morph', component: loadKitchenSinkFramework7('fab-morph') },
  { path: 'kitchen-sink/framework7/fab', component: loadKitchenSinkFramework7('fab') },
  { path: 'kitchen-sink/framework7/form-storage', component: loadKitchenSinkFramework7('form-storage') },
  { path: 'kitchen-sink/framework7/gauge', component: loadKitchenSinkFramework7('gauge') },
  { path: 'kitchen-sink/framework7/grid', component: loadKitchenSinkFramework7('grid') },
  { path: 'kitchen-sink/framework7/icons', component: loadKitchenSinkFramework7('icons') },
  { path: 'kitchen-sink/framework7/infinite-scroll', component: loadKitchenSinkFramework7('infinite-scroll') },
  { path: 'kitchen-sink/framework7/inputs', component: loadKitchenSinkFramework7('inputs') },
  { path: 'kitchen-sink/framework7/lazy-load', component: loadKitchenSinkFramework7('lazy-load') },
  { path: 'kitchen-sink/framework7/list-index', component: loadKitchenSinkFramework7('list-index') },
  { path: 'kitchen-sink/framework7/list', component: loadKitchenSinkFramework7('list') },
  { path: 'kitchen-sink/framework7/menu', component: loadKitchenSinkFramework7('menu') },
  { path: 'kitchen-sink/framework7/messages', component: loadKitchenSinkFramework7('messages') },
  { path: 'kitchen-sink/framework7/navbar', component: loadKitchenSinkFramework7('navbar') },
  { path: 'kitchen-sink/framework7/navbar-hide-scroll', component: loadKitchenSinkFramework7('navbar-hide-scroll') },
  { path: 'kitchen-sink/framework7/photo-browser', component: loadKitchenSinkFramework7('photo-browser') },
];
