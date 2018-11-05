const _modulesLocales = {};
const _locales = {};
const _atomClasses = {};
const _actions = {};
const _flags = {};
const _functions = {};
const _menus = {};

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's base
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get host() {
      const config = ctx.config.module(moduleInfo.relativeName);
      return config.host || ctx.host;
    }

    get protocol() {
      const config = ctx.config.module(moduleInfo.relativeName);
      return config.protocol || ctx.protocol;
    }

    modules() {
      if (!_modulesLocales[ctx.locale]) {
        _modulesLocales[ctx.locale] = this._prepareModules();
      }
      return _modulesLocales[ctx.locale];
    }

    locales() {
      if (!_locales[ctx.locale]) {
        _locales[ctx.locale] = this._prepareLocales();
      }
      return _locales[ctx.locale];
    }

    atomClasses() {
      if (!_atomClasses[ctx.locale]) {
        _atomClasses[ctx.locale] = this._prepareAtomClasses();
      }
      return _atomClasses[ctx.locale];
    }

    atomClass({ module, atomClassName }) {
      const _atomClasses = this.atomClasses();
      return _atomClasses[module][atomClassName];
    }

    actions() {
      if (!_actions[ctx.locale]) {
        _actions[ctx.locale] = this._prepareActions();
      }
      return _actions[ctx.locale];
    }

    action({ module, atomClassName, code, name }) {
      const _actions = this.actions();
      const actions = _actions[module][atomClassName];
      if (name) return actions[name];
      const key = Object.keys(actions).find(key => actions[key].code === code);
      return actions[key];
    }

    flags() {
      if (!_flags[ctx.locale]) {
        _flags[ctx.locale] = this._prepareFlags();
      }
      return _flags[ctx.locale];
    }

    menus() {
      if (!_menus[ctx.locale]) {
        _menus[ctx.locale] = this._prepareMenus();
      }
      return _menus[ctx.locale];
    }

    functions() {
      if (!_functions[ctx.locale]) {
        _functions[ctx.locale] = this._prepareFunctions();
      }
      return _functions[ctx.locale];
    }

    function({ module, name }) {
      const _functions = this.functions();
      return _functions[module][name];
    }

    functionsAutoRight({ module, atomClassName, action }) {
      const functions = {};
      const _functions = this.functions();
      for (const key in _functions[module]) {
        const _func = _functions[module][key];
        const _action = typeof action === 'string' ? _func.action : ctx.constant.module(moduleInfo.relativeName).atom.action[_func.action];
        if (_func.autoRight && _func.atomClassName === atomClassName && _action === action) {
          functions[key] = _func;
        }
      }
      return functions;
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
        _module.titleLocale = ctx.text(_module.title);
        modules[relativeName] = _module;
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

    _prepareAtomClasses() {
      const atomClasses = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          atomClasses[relativeName] = this._prepareAtomClassesModule(module, module.main.meta.base.atoms);
        }
      }
      return atomClasses;
    }

    _prepareAtomClassesModule(module, _atoms) {
      const atomClasses = {};
      for (const key in _atoms) {
        const _atom = _atoms[key].info;
        // info
        const atomClass = {
          name: key,
          title: _atom.title || key,
          public: _atom.public ? 1 : 0,
          flow: _atom.flow ? 1 : 0,
        };
        // tableName
        for (const key in _atom) {
          if (key.indexOf('tableName') === 0) {
            atomClass[key] = _atom[key];
          }
        }
        // titleLocale
        atomClass.titleLocale = ctx.text(atomClass.title);
        // ok
        atomClasses[key] = atomClass;
      }
      return atomClasses;
    }

    _prepareFlags() {
      const flags = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          flags[relativeName] = {};
          for (const atomClassName in module.main.meta.base.atoms) {
            flags[relativeName][atomClassName] = this._prepareFlagsAtomClass(module, module.main.meta.base.atoms[atomClassName]);
          }
        }
      }
      return flags;
    }

    _prepareFlagsAtomClass(module, atomClass) {
      const flags = {};
      const _flags = atomClass.flags;
      for (const key in _flags) {
        const flag = {
          title: _flags[key].title,
        };
        flag.titleLocale = ctx.text(flag.title);
        flags[key] = flag;
      }
      return flags;
    }

    _prepareActions() {
      const actions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          actions[relativeName] = {};
          for (const atomClassName in module.main.meta.base.atoms) {
            actions[relativeName][atomClassName] = this._prepareActionsAtomClass(module, module.main.meta.base.atoms[atomClassName]);
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
      //  _actionsSystem
      for (const key in _actionsSystem) {
        if (key !== 'custom') {
          const action = {
            code: _actionsSystem[key],
            name: key,
            title: _actionsSystemMeta[key].title,
            flag: (_actions && _actions[key] && _actions[key].flag) || '',
            authorize: _actionsSystemMeta[key].authorize !== false,
          };
          if (_actions && _actions[key] && (_actions[key].actionComponent || _actions[key].actionPath)) {
            // custom
            action.actionModule = _actions[key].actionModule || module.info.relativeName;
            action.actionComponent = _actions[key].actionComponent;
            action.actionPath = _actions[key].actionPath;
            action.meta = _actions[key].meta;
          } else {
            // default
            action.actionModule = moduleInfo.relativeName;
            action.actionComponent = _actionsSystemMeta[key].actionComponent;
            action.actionPath = _actionsSystemMeta[key].actionPath;
            action.meta = (_actions && _actions[key] && _actions[key].meta) || _actionsSystemMeta[key].meta;
          }
          action.titleLocale = ctx.text(action.title);
          actions[key] = action;
        }
      }
      //  _actions
      if (_actions) {
        for (const key in _actions) {
          if (!_actionsSystem[key]) {
            const action = {
              code: _actions[key].code,
              name: key,
              title: _actions[key].title || key,
              flag: _actions[key].flag || '',
              actionModule: _actions[key].actionModule || module.info.relativeName,
              actionComponent: _actions[key].actionComponent,
              actionPath: _actions[key].actionPath,
              authorize: _actions[key].authorize !== false,
              meta: _actions[key].meta,
            };
            if (!_actions[key].actionComponent && !_actions[key].actionPath) {
              // default
              action.actionModule = _actions[key].actionModule || moduleInfo.relativeName;
              action.actionComponent = 'action';
              action.actionPath = '';
            } else {
              // custom
              action.actionModule = _actions[key].actionModule || module.info.relativeName;
              action.actionComponent = _actions[key].actionComponent;
              action.actionPath = _actions[key].actionPath;
            }
            action.titleLocale = ctx.text(action.title);
            actions[key] = action;
          }
        }
      }
      return actions;
    }

    _prepareMenus() {
      const menus = {};
      const functions = this._prepareFunctions();
      for (const relativeName in functions) {
        const functionsModule = functions[relativeName];
        menus[relativeName] = {};
        for (const key in functionsModule) {
          const func = functionsModule[key];
          if (func.menu === 1) {
            menus[relativeName][key] = func;
          }
        }
      }
      return menus;
    }

    _prepareFunctions() {
      const functions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.functions) {
          functions[relativeName] = this._prepareFunctionsModule(module, module.main.meta.base.functions);
        }
      }
      return functions;
    }

    _prepareFunctionsModule(module, _functions) {
      const functions = {};
      for (const key in _functions) {
        const _func = _functions[key];
        const func = {
          name: key,
          title: _func.title || key,
          scene: _func.scene,
          autoRight: _func.autoRight || 0,
          atomClassName: _func.atomClassName,
          action: _func.action,
          actionModule: _func.actionModule || module.info.relativeName,
          actionComponent: _func.actionComponent,
          actionPath: _func.actionPath,
          sorting: _func.sorting || 0,
          menu: _func.menu ? 1 : 0,
          public: _func.public ? 1 : 0,
        };
        func.titleLocale = ctx.text(func.title);
        // create
        if (func.action === 'create' && !func.actionComponent && !func.actionPath) {
          func.actionModule = 'a-base';
          func.actionComponent = 'action';
          // func.actionPath = '/a/base/atom/edit?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}';
        }
        // list
        if (func.action === 'read' && !func.actionComponent && !func.actionPath) {
          func.actionPath = '/a/base/atom/list?module={{module}}&atomClassName={{atomClassName}}';
        }
        // ok
        functions[key] = func;
      }
      return functions;
    }

  }

  return Base;
};
