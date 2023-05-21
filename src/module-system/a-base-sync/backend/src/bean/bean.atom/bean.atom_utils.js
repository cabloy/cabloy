module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async _prepareAtomClassAndAtomClassBase({ key, atomClass, throwWhenEmpty = true }) {
      const atomId = key.atomId;
      // atomClass
      if (!atomClass) {
        atomClass = await ctx.bean.atomClass.getByAtomId({ atomId });
        if (!atomClass) {
          if (throwWhenEmpty) {
            throw new Error(`atomClass not found for atom: ${atomId}`);
          } else {
            return null;
          }
        }
      } else {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        if (!atomClass) ctx.throw.module(moduleInfo.relativeName, 1002);
      }
      // atomClassBase
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // ok
      return { atomClass, atomClassBase };
    }

    async _prepareKeyAndAtomAndAtomClass({ key: keyOuter, atomClass: atomClassOuter, options, throwWhenEmpty = true }) {
      options = Object.assign({}, options);
      const atomId = keyOuter.atomId;
      const res = await this._prepareAtomClassAndAtomClassBase({
        key: keyOuter,
        atomClass: atomClassOuter,
        throwWhenEmpty,
      });
      if (!res) return res;
      const { atomClass, atomClassBase } = res;
      let atom, key;
      if (atomClassBase.itemOnly) {
        key = { atomId, itemId: atomId };
        if (atomClassBase.model) {
          const modelItem = ctx.model.module(atomClass.module)[atomClassBase.model];
          atom = await modelItem.get({ id: atomId });
        } else {
          // not use .read for infinite loop
          atom = await this._get({ key, atomClass });
        }
        // pacth atomIdMain of options
        if (atomClassBase.detail) {
          const atomIdMainField = atomClassBase.detail.atomIdMain || 'atomIdMain';
          options.atomIdMain = atom[atomIdMainField];
        }
      } else {
        atom = await this.modelAtom.get({ id: atomId });
        if (!atom) {
          if (throwWhenEmpty) {
            ctx.throw.module(moduleInfo.relativeName, 1002);
          } else {
            return null;
          }
        }
        if (atom.atomClassId !== atomClass.id) ctx.throw(403);
        key = { atomId, itemId: atom.itemId };
      }
      atom = this._patchAtom({ atom, key, atomClass });
      // ok
      return { key, atom, atomClass, atomClassBase, options };
    }

    _patchAtom({ atom, key, atomClass }) {
      let atomId;
      let itemId;
      if (key) {
        atomId = key.atomId;
        itemId = key.itemId;
      } else {
        atomId = atom.id;
        itemId = atom.itemId || atomId;
      }
      return {
        ...atom,
        atomId,
        itemId,
        atomClassId: atomClass.id,
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
      };
    }

    // forAtomUser
    _checkForAtomUser(atomClass) {
      return atomClass && atomClass.module === 'a-base' && atomClass.atomClassName === 'user';
    }
  }
  return Atom;
};
