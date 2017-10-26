import mock from './mock.vue';

let Vue;

// install
function install(_Vue) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // register mock components
  Vue.component('f7-page', mock);
  Vue.component('f7-navbar', mock);
  Vue.component('f7-block', mock);

}

// export
export default {
  install,
};
