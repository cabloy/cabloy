const path = require('path');
const require3 = require('require3');
const fse = require3('fs-extra');

const _modulesLocales = {};
const _themesLocales = {};
const _locales = {};
const _localeModules = {};
const _resourceTypes = {};
const _atomClasses = {};
const _actions = {};
const _authProvidersLocales = {};

let _hostText = null;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'base');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

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

    modules() {
      if (!_modulesLocales[ctx.locale]) {
        _modulesLocales[ctx.locale] = this._prepareModules();
      }
      return _modulesLocales[ctx.locale];
    }

    themes() {
      if (!_themesLocales[ctx.locale]) {
        _themesLocales[ctx.locale] = this._prepareThemes();
      }
      return _themesLocales[ctx.locale];
    }

    locales() {
      if (!_locales[ctx.locale]) {
        _locales[ctx.locale] = this._prepareLocales();
      }
      return _locales[ctx.locale];
    }

    localeModules() {
      if (!_localeModules[ctx.locale]) {
        _localeModules[ctx.locale] = this._prepareLocaleModules();
      }
      return _localeModules[ctx.locale];
    }

    resourceTypes() {
      if (!_resourceTypes[ctx.locale]) {
        _resourceTypes[ctx.locale] = this._prepareResourceTypes();
      }
      return _resourceTypes[ctx.locale];
    }

    atomClasses() {
      if (!_atomClasses[ctx.locale]) {
        // prepare
        const atomClassesAll = this._prepareAtomClasses();
        // hold
        _atomClasses[ctx.locale] = atomClassesAll;
      }
      return _atomClasses[ctx.locale];
    }

    atomClass({ module, atomClassName }) {
      const _atomClasses = this.atomClasses();
      return _atomClasses[module] && _atomClasses[module][atomClassName];
    }

    actions() {
      if (!_actions[ctx.locale]) {
        _actions[ctx.locale] = this._prepareActions();
      }
      return _actions[ctx.locale];
    }

    action({ module, atomClassName, code, name }) {
      // prepare
      if (name && !isNaN(name)) {
        code = parseInt(name);
        name = null;
      } else if (code && isNaN(code)) {
        name = code;
        code = null;
      }
      // actions
      const _actions = this.actions();
      const actions = _actions[module][atomClassName];
      if (name) return actions[name];
      const key = Object.keys(actions).find(key => actions[key].code === code);
      return actions[key];
    }

    authProviders() {
      if (!_authProvidersLocales[ctx.locale]) {
        _authProvidersLocales[ctx.locale] = this._prepareAuthProviders();
      }
      return _authProvidersLocales[ctx.locale];
    }

    // inner methods

    _prepareModules() {
      const modules = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        const _module = {
          name: relativeName,
          title: module.package.title || module.info.name,
          description: ctx.text(module.package.description),
          info: module.info,
        };
        const icon = module.package.eggBornModule && module.package.eggBornModule.icon;
        if (icon) {
          _module.icon = icon;
        }
        _module.titleLocale = ctx.text(_module.title);
        modules[relativeName] = _module;
      }
      return modules;
    }

    _prepareThemes() {
      const modules = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.package.eggBornModule && module.package.eggBornModule.theme) {
          const _module = {
            name: relativeName,
            title: module.package.title || module.info.name,
            description: ctx.text(module.package.description),
            info: module.info,
          };
          _module.titleLocale = ctx.text(_module.title);
          modules[relativeName] = _module;
        }
      }
      return modules;
    }

    _prepareLocales() {
      const locales = [];
      const config = ctx.config.module(moduleInfo.relativeName);
      for (const locale in config.locales) {
        locales.push({
          title: ctx.text(config.locales[locale]),
          value: locale,
        });
      }
      return locales;
    }

    _prepareLocaleModules() {
      const localeModules = [];
      for (const module of ctx.app.meta.modulesArray) {
        const locale = module.package.eggBornModule && module.package.eggBornModule.locale;
        if (!locale) continue;
        const locales = locale.split(',');
        if (locales.findIndex(item => item === ctx.locale) > -1) {
          localeModules.push(module.info.relativeName);
        }
      }
      return localeModules;
    }

    _prepareResourceTypes() {
      const resourceTypes = {};
      for (const module of ctx.app.meta.modulesArray) {
        const moduleName = module.info.relativeName;
        const resources = module.main.meta && module.main.meta.base && module.main.meta.base.resources;
        if (!resources) continue;
        for (const key in resources) {
          const resource = resources[key];
          const fullKey = `${moduleName}:${key}`;
          resourceTypes[fullKey] = {
            ...resource,
            titleLocale: ctx.text(resource.title),
          };
        }
      }
      return resourceTypes;
    }

    _prepareAtomClasses() {
      const atomClasses = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          const res = this._prepareAtomClassesModule(module, module.main.meta.base.atoms);
          if (Object.keys(res).length > 0) {
            atomClasses[relativeName] = res;
          }
        }
      }
      return atomClasses;
    }

    _prepareAtomClassesModule(module, _atoms) {
      const atomClasses = {};
      for (const key in _atoms) {
        const _atomClass = _atoms[key].info;
        // enableRight
        let enableRight;
        if (_atomClass.itemOnly) {
          enableRight = {
            mine: false,
            role: true,
            custom: false,
          };
        } else {
          enableRight = {
            mine: true,
            role: {
              scopes: true,
            },
            custom: false,
          };
        }
        // info
        const atomClass = ctx.bean.util.extend({ name: key, enableRight }, _atomClass);
        // patch itemOnly
        if (_atomClass.itemOnly) {
          Object.assign(atomClass, {
            language: false,
            category: false,
            tag: false,
            simple: true,
            history: false,
            inner: true,
            comment: false,
            attachment: false,
            cms: false,
          });
        }
        // titleLocale
        atomClass.titleLocale = ctx.text(atomClass.title);
        // ok
        atomClasses[key] = atomClass;
      }
      return atomClasses;
    }

    _prepareActions() {
      const actions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          const res = {};
          for (const atomClassName in module.main.meta.base.atoms) {
            const res2 = this._prepareActionsAtomClass(module, module.main.meta.base.atoms[atomClassName]);
            if (Object.keys(res2).length > 0) {
              res[atomClassName] = res2;
            }
          }
          if (Object.keys(res).length > 0) {
            actions[relativeName] = res;
          }
        }
      }
      return actions;
    }

    _prepareActionsAtomClass(module, atomClass) {
      const actions = {};
      const _actions = atomClass.actions;
      const _actionsSystem = ctx.constant.module(moduleInfo.relativeName).atom.action;
      const _actionsSystemMeta = ctx.constant.module(moduleInfo.relativeName).atom.actionMeta;
      const _actionsAll = ctx.bean.util.extend({}, _actionsSystemMeta, _actions);
      for (const key in _actionsAll) {
        if (key === 'custom') continue;
        const action = _actionsAll[key];
        if (!action.code) action.code = _actionsSystem[key];
        action.name = key;
        action.titleLocale = ctx.text(action.title);
        actions[key] = action;
      }
      return actions;
    }

    _prepareAuthProviders() {
      const authProviders = {};
      for (const module of ctx.app.meta.modulesArray) {
        const relativeName = module.info.relativeName;
        let metaAuth = module.main.meta && module.main.meta.auth;
        if (!metaAuth) continue;
        if (typeof metaAuth === 'function') {
          metaAuth = metaAuth(ctx.app);
        }
        if (!metaAuth.providers) continue;
        // loop
        for (const providerName in metaAuth.providers) {
          const _authProvider = metaAuth.providers[providerName];
          const providerFullName = `${relativeName}:${providerName}`;
          if (!_authProvider.meta.title) {
            throw new Error(`should specify the title of auth provider: ${providerFullName}`);
          }
          const authProvider = ctx.bean.util.extend({}, _authProvider);
          this._prepareAuthProvider(relativeName, providerName, authProvider);
          authProviders[providerFullName] = authProvider;
        }
      }
      return authProviders;
    }

    _prepareAuthProvider(relativeName, providerName, authProvider) {
      const meta = authProvider.meta;
      meta.titleLocale = ctx.text(meta.title);
      // meta
      this._prepareAuthProvider_meta(relativeName, meta);
      // scenes
      const scenes = authProvider.scenes;
      if (scenes) {
        for (const sceneName in scenes) {
          const scene = scenes[sceneName];
          this._prepareAuthProvider_meta(relativeName, scene.meta);
          scene.meta = this._prepareAuthProvider_mergeMetaScene(scene.meta, meta);
        }
      }
    }

    _prepareAuthProvider_mergeMetaScene(metaScene, metaConfig) {
      const _meta = {};
      for (const key of ['mode', 'inner', 'inline', 'disableAssociate', 'render', 'validator']) {
        if (metaConfig[key] !== undefined) {
          _meta[key] = metaConfig[key];
        }
      }
      return ctx.bean.util.extend({}, _meta, metaScene);
    }

    _prepareAuthProvider_meta(relativeName, meta) {
      if (typeof meta.bean === 'string') {
        meta.bean = { module: relativeName, name: meta.bean };
      }
      if (typeof meta.render === 'string') {
        meta.render = { module: relativeName, name: meta.render };
      }
      if (typeof meta.validator === 'string') {
        meta.validator = { module: relativeName, validator: meta.validator };
      }
    }
  }

  return Base;
};
