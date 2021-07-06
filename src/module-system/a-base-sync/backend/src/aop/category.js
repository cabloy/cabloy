module.exports = ctx => {
  class localAop {
    async children(context, next) {
      // next
      await next();
      // check atomClass
      const params = context.arguments[0];
      const atomClass = params.atomClass;
      if (!atomClass) return;
      // check if resource
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      if (!atomClassBase.resource) return;
      // resourceTypes for a-base:resource
      const resourceTypes = ctx.bean.base.resourceTypes();
      // locale
      const list = context.result;
      for (const item of list) {
        if (item.categoryIdParent === 0 && atomClass.module === 'a-base' && atomClass.atomClassName === 'resource') {
          // resource type
          const resourceType = resourceTypes[item.categoryName];
          if (resourceType) {
            item.categoryNameLocale = resourceType.titleLocale;
          }
        } else {
          // general name
          item.categoryNameLocale = ctx.text(item.categoryName);
        }
      }
    }
  }

  return localAop;
};
