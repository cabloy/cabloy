module.exports = class File extends module.meta.class.Model {
  constructor() {
    super({ table: 'aFile', options: { disableDeleted: false } });
  }
};
