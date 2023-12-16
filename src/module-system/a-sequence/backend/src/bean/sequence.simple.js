module.exports = class Sequence {
  async execute(context) {
    let value = context.value;
    return ++value;
  }
};
