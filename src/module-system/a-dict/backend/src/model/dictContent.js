module.exports = app => {
  class DictContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDictContent', options: { disableDeleted: false } });
    }
  }
  return DictContent;
};
