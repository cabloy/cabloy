module.exports = app => {
  class ResourceLocale extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aResourceLocale', options: { disableDeleted: true } });
    }
  }
  return ResourceLocale;
};
