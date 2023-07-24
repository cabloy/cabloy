module.exports = app => {
  class Detail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDetailBase', options: { disableDeleted: false } });
    }
  }

  return Detail;
};
