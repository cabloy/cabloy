module.exports = app => {
  // meta
  const meta = {
    user: {
      functions: {
        myAtoms: {
          title: 'Atoms',
          actionPath: '/a/basefront/atom/list?scene=mine',
        },
        myComments: {
          title: 'Comments',
          actionPath: '/a/basefront/comment/all?scene=mine',
        },
        myExports: {
          title: 'Exports',
          actionPath: '/a/user/user/exports',
        },
      },
    },
  };
  return meta;
};
