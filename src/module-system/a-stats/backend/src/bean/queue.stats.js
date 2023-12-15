module.exports = class Queue {
  async execute(context) {
    const data = context.data;
    return await this.ctx.bean.stats._notify_queue(data);
  }
};
