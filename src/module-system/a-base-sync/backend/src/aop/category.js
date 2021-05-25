module.exports = ctx => {
  class localAop {

    async children(context, next) {
      // next
      await next();
      // check atomClass
      const params = context.arguments[0];
      const atomClass = params.atomClass;
      if (!atomClass) return;
      if (atomClass.module !== 'a-base' || atomClass.atomClassName !== 'resource') return;
      // resourceTypes
      const resourceTypes = ctx.bean.base.resourceTypes();
      // locale
      const list = context.result;
      for (const item of list) {
        if (item.categoryIdParent === 0) {
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
