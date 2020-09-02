module.exports = app => {

  class Event extends app.Service {

    async dingtalkCallback({ event, data }) {
      const message = data.message;
      console.log('-------dingtalk callback, EventType: ', message.EventType);
    }

  }

  return Event;
};
