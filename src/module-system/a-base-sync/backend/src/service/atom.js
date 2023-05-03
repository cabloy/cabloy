module.exports = app => {
  class Atom extends app.Service {
    async preferredRoles({ atomClass, user }) {
      return await this.ctx.bean.atom.preferredRoles({ atomClass, user });
    }

    async preferredRole({ atomClass, user }) {
      return await this.ctx.bean.atom.preferredRole({ atomClass, user });
    }

    async preferredRoleId({ atomClass, user }) {
      return await this.ctx.bean.atom.preferredRoleId({ atomClass, user });
    }

    async createDelayGetItem({ atomClass, roleIdOwner, item, options, user }) {
      return await this.ctx.bean.atom.createDelayGetItem({ atomClass, roleIdOwner, item, options, user });
    }

    async create({ atomClass, roleIdOwner, item, options, user }) {
      return await this.ctx.bean.atom.create({ atomClass, roleIdOwner, item, options, user });
    }

    async atomClass({ key, user }) {
      const atomClass = await this.ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      return {
        id: atomClass.id,
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
      };
    }
    async read({ key, atomClass, options, user }) {
      return await this.ctx.bean.atom.read({ key, atomClass, options, user });
    }

    async select({ atomClass, options, user }) {
      return await this.ctx.bean.atom.select({ atomClass, options, user });
    }

    async count({ atomClass, options, user }) {
      return await this.ctx.bean.atom.count({ atomClass, options, user });
    }

    async write({ key, atomClass, item, options, user }) {
      return await this.ctx.bean.atom.write({ key, atomClass, item, options, user });
    }

    async openDraft({ key, atomClass, user }) {
      return await this.ctx.bean.atom.openDraft({ key, atomClass, user });
    }

    async submit({ key, options, user }) {
      return await this.ctx.bean.atom.submit({ key, options, user });
    }

    async delete({ key, atomClass, user }) {
      return await this.ctx.bean.atom.delete({ key, atomClass, user });
    }

    async deleteBulk({ atomClass, keys, user }) {
      return await this.ctx.bean.atom.deleteBulk({ atomClass, keys, user });
    }

    async clone({ key, atomClass, user }) {
      return await this.ctx.bean.atom.clone({ key, atomClass, user });
    }

    async enable({ key, user }) {
      return await this.ctx.bean.atom.enable({ key, user });
    }

    async disable({ key, user }) {
      return await this.ctx.bean.atom.disable({ key, user });
    }

    async exportBulk({ atomClass, options, fields, user }) {
      return await this.ctx.bean.atom.exportBulk({ atomClass, options, fields, user });
    }

    async importBulk({ atomClass, file, user }) {
      const actionBase = this.ctx.bean.base.action({
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        name: 'importBulk',
      });
      // options
      const options = actionBase.params;
      // check isTest
      if (options.progress && !app.meta.isTest) {
        const progressId = await this.ctx.bean.progress.create();
        options.progressId = progressId;
        // background
        this.ctx.runInBackground(async () => {
          // importBulk
          await this.ctx.bean.atom.importBulk({ atomClass, options, file, user });
        });
        return { progressId };
      }
      // importBulk
      await this.ctx.bean.atom.importBulk({ atomClass, options, file, user });
    }

    async star({ key, atom, user }) {
      return await this.ctx.bean.atom.star({ key, atom, user });
    }

    async readCount({ key, atom, user }) {
      return await this.ctx.bean.atom.readCount({ key, atom, user });
    }

    async stats({ atomIds, user }) {
      return await this.ctx.bean.atom.stats({ atomIds, user });
    }

    async labels({ key, atom, user }) {
      return await this.ctx.bean.atom.labels({ key, atom, user });
    }

    async actions({ key, atomClass, options, basic, user }) {
      return await this.ctx.bean.atom.actions({ key, atomClass, options, basic, user });
    }

    async actionsBulk({ atomClass, stage, options, user }) {
      return await this.ctx.bean.atom.actionsBulk({ atomClass, stage, options, user });
    }

    async checkRightAction({ key, atomClass, action, stage, user, checkFlow }) {
      return await this.ctx.bean.atom.checkRightAction({
        atom: { id: key.atomId },
        atomClass,
        action,
        stage,
        user,
        checkFlow,
      });
    }

    async schema({ atomClass, schema }) {
      return await this.ctx.bean.atom.schema({ atomClass, schema });
    }

    async validator({ atomClass }) {
      return await this.ctx.bean.atom.validator({ atomClass });
    }
  }

  return Atom;
};
