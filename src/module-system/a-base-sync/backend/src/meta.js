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
          menu: 2,
        },
        panelAtom: {
          title: 'Atom',
          menu: 2,
        },
        panelSearch: {
          title: 'Search',
          menu: 2,
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
