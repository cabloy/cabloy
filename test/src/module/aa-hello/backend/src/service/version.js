module.exports = app => {

  class Version extends app.Service {

    async update(version) {
      // eslint-disable-next-line
      if (version === 1) {}
    }

  }

  return Version;
};
