module.exports = app => {
  class Schedule extends app.meta.BeanBase {

    async execute() {
      console.log('-----Schedule Test:', this.ctx.instance.id, new Date());
    }

  }

  return Schedule;
};
