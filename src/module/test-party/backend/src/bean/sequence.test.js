module.exports = ctx => {
  class Sequence {

    async execute(context) {
      let value = context.value;
      return ++value;
    }

  }

  return Sequence;
};
