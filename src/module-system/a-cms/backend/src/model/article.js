module.exports = class Article extends module.meta.class.Model {
  constructor() {
    super({ table: 'aCmsArticle', options: { disableDeleted: false } });
  }
};
