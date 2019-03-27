module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Event extends app.Service {

    async atomClassValidator({ event, data: { atomClass, user } }) {
      if (atomClass.module === moduleInfo.relativeName && atomClass.atomClassName === 'post') {
        const validator = {
          module: 'a-cms',
          validator: 'article',
        };
        event.break = true;
        return validator;
      }
    }

  }

  return Event;
};
