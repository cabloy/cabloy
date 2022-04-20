module.exports = app => {
  class cli extends app.Service {
    async meta() {}
  }

  return cli;
};
