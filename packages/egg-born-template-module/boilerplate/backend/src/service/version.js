module.exports = app => {

  class Version extends app.Service {

    async update(version) {
      // eslint-disable-next-line
      if (version === 1) {}

      // can provide test data here
      // eslint-disable-next-line
      if (version === 0) {}
    }

  }

  return Version;
};
