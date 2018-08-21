module.exports = app => {
  class Article extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aArticle', options: { disableDeleted: false } });
    }
  }
  return Article;
};
