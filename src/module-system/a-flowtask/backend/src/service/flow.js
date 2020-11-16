module.exports = app => {

  class Flow extends app.Service {

    async data({ flowId, user }) {
      return 'ddddd';
    }

  }
  return Flow;
};

