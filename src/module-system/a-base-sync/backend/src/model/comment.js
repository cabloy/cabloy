module.exports = app => {

  class Comment extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aComment', options: { disableDeleted: false } });
    }

  }

  return Comment;
};
