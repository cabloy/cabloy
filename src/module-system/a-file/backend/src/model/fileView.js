module.exports = class FileView extends module.app.meta.Model {
  constructor() {
    super({ table: 'aViewFile', options: { disableDeleted: false } });
  }
};
