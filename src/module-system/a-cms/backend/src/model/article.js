module.exports = class Article extends module.app.meta.Model {
  constructor() {
    super({ table: 'aCmsArticle', options: { disableDeleted: false } });
  }
};
