module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
        post: {
          info: {
            title: 'Post',
            tableName: 'cmsPost',
          },
          actions: {
          },
          flags: {
          },
          validator: 'post',
          search: {
            validator: 'postSearch',
          },
        },
      },
      functions: {
        createPost: {
          title: 'Create Post',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'post',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        listPost: {
          title: 'Post List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'post',
          action: 'read',
          sorting: 1,
          menu: 1,
        },
      },
    },
    validation: {
      validators: {
        post: {
          schemas: 'post',
        },
        postSearch: {
          schemas: 'postSearch',
        },
      },
      keywords: {},
      schemas: {
        post: schemas.post,
        postSearch: schemas.postSearch,
      },
    },
  };
  return meta;
};
