module.exports = app => {
  class Document extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'cmsDocument', options: { disableDeleted: false } });
    }
  }
  return Document;
};
