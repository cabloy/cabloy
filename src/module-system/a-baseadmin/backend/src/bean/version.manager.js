module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {}
    }

    async init(options) {
      if (options.version === 1) {}

      if (options.version === 2) {}

      if (options.version === 3) {}

    }

  }

  return Version;
};
