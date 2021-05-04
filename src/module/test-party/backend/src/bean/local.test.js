module.exports = ctx => {
  class localTest {

    get name() {
      return 'localTest';
    }

  }

  return localTest;
};
