module.exports = app => {
  class Schedule extends app.Service {

    async loadSchedules() {
      await app.meta._loadSchedules();
    }
  }

  return Schedule;
};
