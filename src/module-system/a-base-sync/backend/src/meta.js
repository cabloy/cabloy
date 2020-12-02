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
          actionPath: '/a/basefront/comment/all',
        },
        deleteComment: {
          title: 'Delete Comment',
          menu: 0,
        },
      },
    },
    sequence: {
      providers: {
        draft: {
          bean: {
            module: 'a-sequence',
            name: 'simple',
          },
          start: 0,
        },
        userName: {
          bean: {
            module: 'a-sequence',
            name: 'simple',
          },
          start: 0,
        },
      },
    },
    validation: {
      validators: {
        user: {
          schemas: 'user',
        },
        category: {
          schemas: 'category',
        },
      },
      keywords: {
        'x-exists': keywords.exists,
      },
      schemas: {
        user: schemas.user,
        category: schemas.category,
      },
    },
    event: {
      declarations: {
        loginInfo: 'Login Info',
        userVerify: 'User Verify',
        accountMigration: 'Account Migration',
      },
    },
  };
  return meta;
};
