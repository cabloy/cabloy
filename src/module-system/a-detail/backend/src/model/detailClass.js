module.exports = app => {

  class DetailClass extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aDetailClass', options: { disableDeleted: false } });
    }

  }

  return DetailClass;
};
