module.exports = app => {
  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
      }
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};
