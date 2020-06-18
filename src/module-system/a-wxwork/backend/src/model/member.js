module.exports = app => {
  class Member extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aWxworkMember', options: { disableDeleted: false } });
    }
  }
  return Member;
};
