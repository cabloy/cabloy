module.exports = ctx => {
  class Queue {

    async execute(context) {
      const data = context.data;
      return data.a + data.b;
    }

  }

  return Queue;
};
