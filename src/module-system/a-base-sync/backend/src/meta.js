module.exports = app => {
  // keywords
  const keywords = require('./config/validation/keywords.js')(app);
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // meta
  const meta = {
    base: {
      functions: {
        listComment: {
          title: 'Comment List',
          scene: 'list',
          sorting: 1,
          menu: 1,
          actionPath: 'comment/all',
        },
        deleteComment: {
          title: 'Delete Comment',
          menu: 0,
        },
        // panels
        panelMenu: {
          title: 'Menu',
          url: '/a/base/menu/list',
          menu: 2,
          public: 1,
        },
        panelAtom: {
          title: 'Atom',
          url: '/a/base/atom/list',
          menu: 2,
          public: 1,
        },
        panelSearch: {
          title: 'Search',
          url: '/a/base/atom/searchQuick',
          menu: 2,
          public: 1,
        },
        // widgets
        widgetAbout: {
          title: 'About',
          component: 'widgetAbout',
          menu: 3,
          public: 1,
        },
        // sections
        sectionCopyright: {
          title: 'Copyright',
          component: 'sectionCopyright',
          menu: 4,
          public: 1,
        },
      },
    },
    sequence: {
      providers: {
        draft: {
          start: 0,
          expression({ ctx, value }) {
            return ++value;
          },
        },
        userName: {
          start: 0,
          expression({ ctx, value }) {
            return ++value;
          },
        },
      },
    },
    validation: {
      validators: {
        user: {
          schemas: 'user',
        },
      },
      keywords: {
        'x-exists': keywords.exists,
      },
      schemas: {
        user: schemas.user,
      },
    },
    event: {
      declarations: {
        loginInfo: 'Login Info',
        userVerify: 'User Verify',
        atomClassValidator: 'Atom Validator',
      },
    },
  };
  return meta;
};
