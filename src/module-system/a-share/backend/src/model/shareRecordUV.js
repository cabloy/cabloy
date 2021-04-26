module.exports = app => {
  class ShareRecordUV extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aShareRecordUV', options: { disableDeleted: false } });
    }
  }
  return ShareRecordUV;
};
