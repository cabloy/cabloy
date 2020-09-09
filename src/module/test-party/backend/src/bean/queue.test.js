module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const data = context.data;
      return data.a + data.b;
    }

  }

  return Queue;
};
