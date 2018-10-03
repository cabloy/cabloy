module.exports = app => {
  class ArticleTag extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsArticleTag', options: { disableDeleted: true } });
    }
  }
  return ArticleTag;
};
