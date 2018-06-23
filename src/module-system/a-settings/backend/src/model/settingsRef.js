module.exports = app => {

  class SettingsRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aSettingsRef', options: { disableDeleted: true } });
    }

  }

  return SettingsRef;
};
