module.exports = app => {
  class ArticleTagRef extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsArticleTagRef', options: { disableDeleted: true } });
    }
  }
  return ArticleTagRef;
};
