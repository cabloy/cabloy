module.exports = app => {
  class Demo extends app.Service {
    async action() {}
  }

  return Demo;
};
