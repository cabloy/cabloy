module.exports = app => {
  // this module
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // article bean
  const articleBeanModule = 'a-cms';
  const articleBeanFullName = 'a-cms.atom.article';

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        context: { atomClass, item, user },
        fn: 'create',
      });
    }

    async read({ atomClass, key, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        context: { atomClass, key, user },
        fn: 'read',
      });
    }

    async select({ atomClass, options, items, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        context: { atomClass, options, items, user },
        fn: 'select',
      });
    }

    async write({ atomClass, target, key, item, options, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        context: { atomClass, target, key, item, options, user },
        fn: 'write',
      });
    }

    async delete({ atomClass, key, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        context: { atomClass, key, user },
        fn: 'delete',
      });
    }

    async submit({ atomClass, key, options, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        context: { atomClass, key, options, user },
        fn: 'submit',
      });
    }

  }

  return Atom;
};
