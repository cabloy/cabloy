module.exports = app => {
  class {{atomClassNameCapitalize}} extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: '{{providerId}}{{atomClassNameCapitalize}}', options: { disableDeleted: false } });
    }
  }
  return {{atomClassNameCapitalize}};
};
