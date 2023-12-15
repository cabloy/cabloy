module.exports = class VersionTest {
  async run(options) {
    // why add these test codes
    //   - for force flowHistory.id !== flow.id
    // flowHistory
    let res = await this.ctx.model.flowHistory.insert({});
    await this.ctx.model.flowHistory.delete({ id: res.insertId });
    // flowNodeHistory
    res = await this.ctx.model.flowNodeHistory.insert({});
    await this.ctx.model.flowNodeHistory.delete({ id: res.insertId });
  }
};
