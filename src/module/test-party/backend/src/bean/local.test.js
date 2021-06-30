module.exports = ctx => {
  class LocalTest {

    get name() {
      return 'localTest';
    }

  }

  return LocalTest;
};
