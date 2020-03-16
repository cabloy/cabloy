const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // meta
  const meta = {
    base: {
      functions: {
        user: {
          title: 'User Management',
          scene: 'tools',
          actionPath: 'user/list',
          sorting: 11,
          menu: 1,
        },
        role: {
          title: 'Role Management',
          scene: 'tools',
          actionPath: 'role/list',
          sorting: 12,
          menu: 1,
        },
        atomRight: {
          title: 'Atom Right Management',
          scene: 'tools',
          actionPath: 'atomRight/list',
          sorting: 13,
          menu: 1,
        },
        functionRight: {
          title: 'Function Right Management',
          scene: 'tools',
          actionPath: 'functionRight/types',
          sorting: 14,
          menu: 1,
        },
        auth: {
          title: 'Auth Management',
          scene: 'tools',
          actionPath: 'auth/list',
          sorting: 15,
          menu: 1,
        },
        menuManagement: {
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
