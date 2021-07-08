module.exports = app => {
  class Note extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'testNote', options: { disableDeleted: false } });
    }
  }
  return Note;
};
