module.exports = class UserOnlineHistory extends module.app.meta.Model {
  constructor() {
    super({ table: 'aUserOnlineHistory', options: { disableDeleted: false } });
  }
};
