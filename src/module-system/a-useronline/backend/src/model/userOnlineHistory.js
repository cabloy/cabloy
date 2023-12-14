module.exports = class UserOnlineHistory extends module.meta.class.Model {
  constructor() {
    super({ table: 'aUserOnlineHistory', options: { disableDeleted: false } });
  }
};
