module.exports = app => {

  class Contacts extends app.Service {

    async queueSync({ type, mode }) {
      console.log('----sync:', type, mode);
    }

  }

  return Contacts;
};
