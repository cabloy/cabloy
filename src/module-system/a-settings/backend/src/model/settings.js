module.exports = app => {

  class Settings extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aSettings', options: { disableDeleted: true } });
    }

  }

  return Settings;
};
