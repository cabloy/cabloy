module.exports = app => {

  class CommentView extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aViewComment', options: { disableDeleted: false } });
    }

  }

  return CommentView;
};
