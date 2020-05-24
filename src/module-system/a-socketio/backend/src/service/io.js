module.exports = app => {

  class IO extends app.Service {

    async subscribe({ subscribes, clientId }) {
      // redis

    }

    async unsubscribe({ subscribes, clientId }) {

    }

  }

  return IO;
};
