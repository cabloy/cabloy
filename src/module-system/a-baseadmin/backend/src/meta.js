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
          sorting: 1,
          menu: 1,
        },
        role: {
          title: 'Role Management',
          scene: 'tools',
          actionPath: 'role/list',
          sorting: 2,
          menu: 1,
        },
        atomRight: {
          title: 'Atom Right Management',
          scene: 'tools',
          actionPath: 'atomRight/list',
          sorting: 3,
          menu: 1,
        },
        menuRight: {
          title: 'Menu Right Management',
          scene: 'tools',
          actionPath: 'menuRight/list',
          sorting: 4,
          menu: 1,
        },
        functionRight: {
          title: 'Function Right Management',
          scene: 'tools',
          actionPath: 'functionRight/list',
          sorting: 5,
          menu: 1,
        },
        auth: {
          title: 'Auth Management',
          scene: 'tools',
          actionPath: 'auth/list',
          sorting: 6,
          menu: 1,
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
  };

  return meta;
};
