module.exports = app => {

  class Version extends app.meta.BeanBase {

    // eslint-disable-next-line
    async update(options) {
    }

    async init(options) {

      if (options.version === 1) {}

      if (options.version === 2) {}

    }

  }

  return Version;
};
