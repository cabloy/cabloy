module.exports = class FileView extends module.meta.class.Model {
  constructor() {
    super({ table: 'aViewFile', options: { disableDeleted: false } });
  }
};
