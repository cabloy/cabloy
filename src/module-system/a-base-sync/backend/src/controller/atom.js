module.exports = app => {
  class AtomController extends app.Controller {
    async preferredRoles() {
      const res = await this.ctx.service.atom.preferredRoles({
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async preferredRole() {
      const res = await this.ctx.service.atom.preferredRole({
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async preferredRoleId() {
      const res = await this.ctx.service.atom.preferredRoleId({
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async createDelayGetItem() {
      // options
      const options = this.ctx.request.body.options || {};
      options.ignoreValidate = false;
      // create
      const res = await this.ctx.service.atom.createDelayGetItem({
        atomClass: this.ctx.request.body.atomClass,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async createDelayCheckItem() {
      // options
      const options = this.ctx.request.body.options || {};
      options.ignoreValidate = false;
      // item
      const item = this.ctx.request.body.item;
      // create
      const res = await this.ctx.service.atom.createDelayCheckItem({
        atomClass: this.ctx.request.body.atomClass,
        item,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async create() {
      // options
      const options = this.ctx.request.body.options;
      // item
      const item = this.ctx.request.body.item || {};
      // for safe
      delete item.atomId;
      delete item.itemId;
      delete item.atomStaticKey;
      delete item.atomRevision;
      // create
      const res = await this.ctx.service.atom.create({
        atomClass: this.ctx.request.body.atomClass,
        roleIdOwner: this.ctx.request.body.roleIdOwner,
        item,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async atomClass() {
      const res = await this.ctx.service.atom.atomClass({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.atom.read({
        key: this.ctx.request.body.key,
        atomClass: this.ctx.request.body.atomClass,
        options: this.ctx.request.body.options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    // options
    //   where, orders, page, star, label
    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.bean.util.page(options.page);
      const items = await this.ctx.service.atom.select({
        atomClass: this.ctx.request.body.atomClass,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.atom.count({
        atomClass: this.ctx.request.body.atomClass,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(count);
    }

    async write() {
      const _options = this.ctx.request.body.options;
      const saveDraftOnly = _options && _options.saveDraftOnly;
      const options = {
        ignoreValidate: false,
        saveDraftOnly,
        ignoreNotEmpty: saveDraftOnly,
      };
      await this.ctx.service.atom.write({
        key: this.ctx.request.body.key,
        atomClass: this.ctx.request.body.atomClass,
        item: this.ctx.request.body.item,
        user: this.ctx.state.user.op,
        options,
      });
      this.ctx.success();
    }

    async openDraft() {
      const res = await this.ctx.service.atom.openDraft({
        key: this.ctx.request.body.key,
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async submit() {
      const options = this.ctx.request.body.options || {};
      if (!app.meta.isTest) {
        options.ignoreFlow = false;
      }
      // submit
      const res = await this.ctx.service.atom.submit({
        key: this.ctx.request.body.key,
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async writeSubmit() {
      // write
      const options = { ignoreValidate: false };
      await this.ctx.service.atom.write({
        key: this.ctx.request.body.key,
        item: this.ctx.request.body.item,
        user: this.ctx.state.user.op,
        options,
      });
      // submit
      await this.submit();
    }

    async delete() {
      await this.ctx.service.atom.delete({
        key: this.ctx.request.body.key,
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.state.user.op,
      });
      this.ctx.success();
    }

    async deleteBulk() {
      const res = await this.ctx.service.atom.deleteBulk({
        atomClass: this.ctx.request.body.atomClass,
        keys: this.ctx.request.body.keys,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async clone() {
      const res = await this.ctx.service.atom.clone({
        key: this.ctx.request.body.key,
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async enable() {
      const res = await this.ctx.service.atom.enable({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async disable() {
      const res = await this.ctx.service.atom.disable({
        key: this.ctx.request.body.key,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async exportBulk() {
      const res = await this.ctx.service.atom.exportBulk({
        atomClass: this.ctx.request.body.atomClass,
        options: this.ctx.request.body.options,
        fields: this.ctx.request.body.fields,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async importBulk() {
      const res = await this.ctx.service.atom.importBulk({
        atomClass: this.ctx.request.body.atomClass,
        file: this.ctx.request.body.file,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async star() {
      const res = await this.ctx.service.atom.star({
        key: this.ctx.request.body.key,
        atom: this.ctx.request.body.atom,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async readCount() {
      const res = await this.ctx.service.atom.readCount({
        key: this.ctx.request.body.key,
        atom: this.ctx.request.body.atom,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async stats() {
      const res = await this.ctx.service.atom.stats({
        atomIds: this.ctx.request.body.atomIds,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async labels() {
      const res = await this.ctx.service.atom.labels({
        key: this.ctx.request.body.key,
        atom: this.ctx.request.body.atom,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async actions() {
      const res = await this.ctx.service.atom.actions({
        key: this.ctx.request.body.key,
        atomClass: this.ctx.request.body.atomClass,
        options: this.ctx.request.body.options,
        basic: this.ctx.request.body.basic,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async actionsBulk() {
      const res = await this.ctx.service.atom.actionsBulk({
        atomClass: this.ctx.request.body.atomClass,
        stage: this.ctx.request.body.stage,
        options: this.ctx.request.body.options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async checkRightAction() {
      const res = await this.ctx.service.atom.checkRightAction({
        key: this.ctx.request.body.key,
        atomClass: this.ctx.request.body.atomClass,
        action: this.ctx.request.body.action,
        stage: this.ctx.request.body.stage,
        user: this.ctx.state.user.op,
        checkFlow: this.ctx.request.body.checkFlow,
      });
      this.ctx.success(res);
    }

    async schema() {
      const res = await this.ctx.service.atom.schema({
        atomClass: this.ctx.request.body.atomClass,
        schema: this.ctx.request.body.schema,
      });
      this.ctx.success(res);
    }

    async validator() {
      const res = await this.ctx.service.atom.validator({
        atomClass: this.ctx.request.body.atomClass,
      });
      this.ctx.success(res);
    }
  }
  return AtomController;
};
