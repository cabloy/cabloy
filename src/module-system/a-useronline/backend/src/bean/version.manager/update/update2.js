module.exports = class VersionUpdate {
  async run(options) {
    // aAtom: drop atomId
    const sql = `
        ALTER TABLE aUserOnlineHistory
          DROP COLUMN atomId
      `;
    await this.ctx.model.query(sql);
  }
};
