const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');

let _hostText = null;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {
    get host() {
      // test
      if (ctx.app.meta.isTest) {
        if (_hostText) return _hostText;
        const buildConfig = require3(path.join(process.cwd(), 'build/config.js'));
        const hostname = buildConfig.front.dev.hostname || 'localhost';
        const port = buildConfig.front.dev.port;
        _hostText = `${hostname}:${port}`;
        return _hostText;
      }
      // others
      const config = ctx.config.module(moduleInfo.relativeName);
      return config.host || ctx.host;
    }

    get protocol() {
      const config = ctx.config.module(moduleInfo.relativeName);
      return config.protocol || ctx.protocol;
    }

    getAbsoluteUrl(path) {
      const prefix = this.host ? `${this.protocol}://${this.host}` : '';
      return `${prefix}${path || ''}`;
    }

    // get forward url
    getForwardUrl(path) {
      const prefix = this.useAccelRedirect() ? '/public/' : ctx.app.config.static.prefix + 'public/';
      return `${prefix}${ctx.instance.id}/${path}`;
    }

    useAccelRedirect() {
      return ctx.app.meta.isProd && ctx.app.config.proxyProvider !== 'apache';
    }

    // get root path
    async getRootPath() {
      if (ctx.app.meta.isTest || ctx.app.meta.isLocal) {
        return ctx.app.config.static.dir;
      }
      const dir =
        ctx.config.module(moduleInfo.relativeName).publicDir ||
        path.join(require('os').homedir(), 'cabloy', ctx.app.name, 'public');
      await fse.ensureDir(dir);
      return dir;
    }

    // get path
    async getPath(subdir, ensure) {
      const rootPath = await this.getRootPath();
      // use instance.id, not subdomain
      const dir = path.join(rootPath, ctx.instance.id.toString(), subdir || '');
      if (ensure) {
        await fse.ensureDir(dir);
      }
      return dir;
    }

    // static
    getStaticUrl(path) {
      return this.getAbsoluteUrl(`/api/static${path}`);
    }

    // alert
    getAlertUrl({ data }) {
      return this.getAbsoluteUrl(`/#!/a/basefront/base/alert?data=${encodeURIComponent(JSON.stringify(data))}`);
    }
  }
  return Base;
};
