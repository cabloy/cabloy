
import form from './pages/form.vue';

async function loader() {
  const page = await import('./pages/about.vue');
  return page;
}

export default [
  {
    path: '/about/',
    // component: () => import('./pages/about.vue'),
    // component: loader(), // require('./pages/about.vue'),
    component: () => {
      // const f = import('egg-born-module-aa-test');
      // return import('egg-born-module-aa-test').then(m => {
      //  return m.default.About;
      // });
    },
  },
  {
    path: '/form/',
    // component: form, // require('./pages/form.vue'),
    component: () => require('./pages/form.vue'),
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: require('./pages/dynamic-route.vue').default,
  },
];
