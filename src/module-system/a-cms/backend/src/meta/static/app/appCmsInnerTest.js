// const moduleInfo = module.info;

const info = {
  home: {
    mode: 'page',
    page: '/a/basefront/atom/list?module=a-cms&atomClassName=article',
  },
};
const info2 = {
  'en-us': {
    ...info,
    menu: {
      layout: null,
    },
  },
  'zh-cn': {
    ...info,
    menu: {
      layout: 'a-app:layoutAppMenuDefault',
    },
  },
};
const content = {
  presets: {
    anonymous: {
      mobile: info,
      pc: info,
    },
    authenticated: {
      mobile: info2,
      pc: info2,
    },
  },
};
const _app = {
  atomName: 'CMS(Inner Test)',
  atomStaticKey: 'appCmsInnerTest',
  atomRevision: 3,
  atomCategoryId: 'AppCategoryCMS',
  description: '',
  appIcon: ':outline:article-outline',
  appIsolate: false,
  appLanguage: true,
  appCms: true,
  content: JSON.stringify(content),
  resourceRoles: 'root',
  appSorting: 0,
};
module.exports = _app;
