module.exports = app => {
  class File extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFile', options: { disableDeleted: false } });
    }
  }
  return File;
};
