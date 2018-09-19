module.exports = app => {

  class CommentHeart extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aCommentHeart', options: { disableDeleted: true } });
    }

  }

  return CommentHeart;
};
