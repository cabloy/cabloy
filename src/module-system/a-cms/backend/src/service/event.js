module.exports = app => {

  class Event extends app.Service {

    async atomClassValidator({ event, data: { atomClass, user } }) {
      // donothing
    }

  }

  return Event;
};
