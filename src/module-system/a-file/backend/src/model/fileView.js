module.exports = app => {
  class FileView extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aViewFile', options: { disableDeleted: false } });
    }
  }
  return FileView;
};
