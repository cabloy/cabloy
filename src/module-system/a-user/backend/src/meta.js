const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  // meta
  const meta = {
    user: {
      functions: {
        myAtoms: {
          title: 'Atoms',
          actionPath: '/a/base/atom/list?scene=mine',
        },
        myComments: {
          title: 'Comments',
          actionPath: '/a/base/comment/all?scene=mine',
        },
      },
    },
  };
  return meta;
};
