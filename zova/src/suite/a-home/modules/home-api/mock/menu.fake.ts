import { defineFakeRoute } from 'vite-plugin-fake-server-turbo/client';

const __MenuItems = [
  { order: 0, title: 'Home', caption: '', icon: '::home', link: '/' },
  { group: 'basic', title: 'State', caption: 'ref, computed', icon: '', link: '/demo/basic/state' },
  {
    group: 'basic',
    title: 'Component',
    caption: 'props, emits, slots',
    icon: '',
    link: '/demo/basic/component',
  },
  {
    group: 'basic',
    title: 'Route Query',
    caption: 'Typesafe',
    icon: '',
    link: '/demo/basic/routeQuery',
  },
  {
    group: 'basic',
    title: 'Route Query(2)',
    caption: 'boolean, json, array',
    icon: '',
    link: '/demo/basic/routeQueryB',
  },
  {
    group: 'basic',
    title: 'Route Params',
    caption: 'Typesafe',
    icon: '',
    link: 'demo-basic:routeParams',
  },
  { group: 'basic', title: 'Locale', caption: 'I18n', icon: '', link: '/demo/basic/locale' },
  {
    group: 'basic',
    title: 'CSS-in-JS',
    caption: 'Style & Theme',
    icon: '',
    link: '/demo/basic/style',
  },
  {
    group: 'business',
    title: 'Todo: CRUD',
    caption: 'Model: Unified Data Source',
    icon: '',
    link: '/todo',
  }, // link: '/demo/todo/todo',
  {
    group: 'zova',
    title: 'Docs',
    caption: 'zova.js.org',
    icon: ':social:school',
    external: true,
    link: 'https://zova.js.org',
  },
  {
    group: 'zova',
    title: 'GitHub',
    caption: 'github.com/cabloy',
    icon: ':social:github',
    external: true,
    link: 'https://github.com/cabloy/zova',
  },
];
const __MenuGroups = [
  { order: 1, name: 'basic', title: 'Basic' },
  { order: 2, name: 'business', title: 'Business' },
  { order: 3, name: 'zova', title: 'Zova' },
];
const __MenuData = { menus: __MenuItems, groups: __MenuGroups };

export default defineFakeRoute([
  {
    url: '/home/base/menu/{:publicPath}',
    method: 'get',
    response: req => {
      const name = getNameFromAuthorizationHeader(req);
      if (!name) {
        return { code: 401, message: 'Error menu/select' };
      }
      return {
        code: 0,
        message: 'Success',
        data: __MenuData,
      };
    },
  },
]);

function getNameFromAuthorizationHeader(req: any): string | undefined {
  if (!req.headers.authorization) return undefined;
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return undefined;
  return token.substring('accessToken-'.length);
}
