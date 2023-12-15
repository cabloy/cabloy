module.exports = class Startup {
  async execute() {
    // only in development
    if (!this.app.meta.isLocal) return;
    await this._registerDevelopment();
  }

  async _registerDevelopment() {
    // info
    const watcherInfo = { development: true, watchers: null };
    // register
    this.app.meta['a-cms:watcher'].register(watcherInfo);
  }
};
