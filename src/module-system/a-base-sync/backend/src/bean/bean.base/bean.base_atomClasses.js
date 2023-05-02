const _atomClasses = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {
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
        // model
        if (atomClass.tableName && !atomClass.model) {
          atomClass.model = key;
        }
        // titleLocale
        atomClass.titleLocale = ctx.text(atomClass.title);
        // ok
        atomClasses[key] = atomClass;
      }
      return atomClasses;
    }
  }
  return Base;
};
