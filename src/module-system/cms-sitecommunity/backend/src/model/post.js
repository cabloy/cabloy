module.exports = app => {
  class Post extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'cmsPost', options: { disableDeleted: false } });
    }
  }
  return Post;
};
