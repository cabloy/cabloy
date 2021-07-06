module.exports = app => {
  class Schedule extends app.meta.BeanBase {
    async execute(context) {
      const job = context.job;
      console.log(`----- Schedule Test: iid=${this.ctx.instance.id}, every=${job.data.jobOptions.repeat.every}, ${new Date()}`);
    }
  }

  return Schedule;
};
