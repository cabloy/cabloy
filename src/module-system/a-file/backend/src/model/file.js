module.exports = class File extends module.app.meta.Model {
  constructor() {
    super({ table: 'aFile', options: { disableDeleted: false } });
  }
};
