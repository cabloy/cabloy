module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 3) {
        // ref: a-baselayout
      }
    }

    async init(options) {
      if (options.version === 3) {
        // ref: a-baselayout
      }
      if (options.version === 4) {
        // ref: a-baselayout
      }
    }
  }

  return Version;
};
