module.exports = app => {
  // this module
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  // article module
  const articleBeanModule = 'a-cms';
  const articleBeanFullName = 'a-cms.atom.article';

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        fn: async ({ bean }) => {
          return await bean.create({ atomClass, item, user });
        },
      });
    }

    async read({ atomClass, key, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        fn: async ({ bean }) => {
          return await bean.read({ atomClass, key, user });
        },
      });
    }

    async select({ atomClass, options, items, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        fn: async ({ bean }) => {
          return await bean.select({ atomClass, options, items, user });
        },
      });
    }

    async write({ atomClass, key, item, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        fn: async ({ bean }) => {
          return await bean.write({ atomClass, key, item, user });
        },
      });
    }

    async delete({ atomClass, key, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        fn: async ({ bean }) => {
          return await bean.delete({ atomClass, key, user });
        },
      });
    }

    async action({ action, atomClass, key, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        fn: async ({ bean }) => {
          return await bean.action({ action, atomClass, key, user });
        },
      });
    }

    async enable({ atomClass, key, atom, user }) {
      return await this.ctx.executeBean({
        beanModule: articleBeanModule,
        beanFullName: articleBeanFullName,
        fn: async ({ bean }) => {
          return await bean.enable({ atomClass, key, atom, user });
        },
      });
    }

  }

  return Atom;
};
