module.exports = app => {
  class {{atomClassNameCapitalize}}Detail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: '{{providerId}}{{atomClassNameCapitalize}}Detail', options: { disableDeleted: false } });
    }
  }
  return {{atomClassNameCapitalize}}Detail;
};
