module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // meta
  const meta = {
    base: {
      functions: {
        user: {
          title: 'User Management',
          actionPath: 'user/list',
          sorting: 1,
          menu: 0,
        },
        role: {
          title: 'Role Management',
          actionPath: 'role/list',
          sorting: 1,
          menu: 0,
        },
        atomRight: {
          title: 'Atom Right Management',
          actionPath: 'atomRight/list',
          sorting: 1,
          menu: 0,
        },
        functionRight: {
          title: 'Function Right Management',
          actionPath: 'functionRight/types',
          sorting: 1,
          menu: 0,
        },
        auth: {
          title: 'Auth Management',
          actionPath: 'auth/list',
          sorting: 1,
          menu: 0,
        },
        menu: {
          title: 'Menu Management',
          actionPath: 'function/scene?sceneMenu=1',
          sorting: 1,
          menu: 0,
        },
      },
    },
    validation: {
      validators: {
        role: {
          schemas: 'role',
        },
        auth: {
          schemas: 'auth',
        },
      },
      keywords: {},
      schemas: {
        role: schemas.role,
        auth: schemas.auth,
      },
    },
    settings: {
      instance: {
        actionPath: 'settings/list',
      },
    },
  };

  return meta;
};
