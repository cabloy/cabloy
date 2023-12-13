module.exports = app => {
  // const moduleInfo = module.info;
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        // empty
      }
    }

    async init(options) {
      if (options.version === 1) {
        // empty
      }

      if (options.version === 2) {
        // empty
      }

      if (options.version === 3) {
        // empty
      }
    }
  }

  return Version;
};
