const moduleInfo = module.info;
module.exports = class Version {
  async _test() {
    const atomClass = {
      module: moduleInfo.relativeName,
      atomClassName: 'article',
    };
    // categories
    const categories = [
      // en-us
      { categoryName: 'test1', language: 'en-us', categoryIdParent: 0 },
      { categoryName: 'test2', language: 'en-us', categoryIdParent: 0 },
      { categoryName: 'test2-1', language: 'en-us', categoryIdParent: 'test2' },
      { categoryName: 'test2-2', language: 'en-us', categoryIdParent: 'test2' },
      { categoryName: 'test3', language: 'en-us', categoryIdParent: 0, categorySorting: 1 },
      { categoryName: 'testHidden', language: 'en-us', categoryIdParent: 0, categoryHidden: 1 },
      { categoryName: 'testFlag', language: 'en-us', categoryIdParent: 0, categoryFlag: 'Flag' },
      // zh-cn
      { categoryName: '分类1', language: 'zh-cn', categoryIdParent: 0 },
      { categoryName: '分类2', language: 'zh-cn', categoryIdParent: 0 },
      { categoryName: '分类2-1', language: 'zh-cn', categoryIdParent: '分类2' },
      { categoryName: '分类2-2', language: 'zh-cn', categoryIdParent: '分类2' },
      { categoryName: '分类3', language: 'zh-cn', categoryIdParent: 0, categorySorting: 1 },
      { categoryName: '隐藏分类', language: 'zh-cn', categoryIdParent: 0, categoryHidden: 1 },
      { categoryName: '加标记的分类', language: 'zh-cn', categoryIdParent: 0, categoryFlag: 'Flag' },
    ];
    const categoryIds = {};
    for (const item of categories) {
      // add
      const categoryId = await this.ctx.bean.category.add({
        atomClass,
        data: {
          language: item.language,
          categoryName: item.categoryName,
          categoryHidden: item.categoryHidden,
          categorySorting: item.categorySorting,
          categoryFlag: item.categoryFlag,
          categoryIdParent: item.categoryIdParent ? categoryIds[item.categoryIdParent] : 0,
        },
      });
      categoryIds[item.categoryName] = categoryId;
    }
    // tags
    const tags = [
      // en-us
      { tagName: 'Life', language: 'en-us' },
      { tagName: 'Study', language: 'en-us' },
      { tagName: 'Work', language: 'en-us' },
      // zh-cn
      { tagName: '生活', language: 'zh-cn' },
      { tagName: '学习', language: 'zh-cn' },
      { tagName: '工作', language: 'zh-cn' },
    ];
    const tagIds = {};
    for (const item of tags) {
      // add
      const tagId = await this.ctx.bean.tag.add({
        atomClass,
        data: {
          language: item.language,
          tagName: item.tagName,
        },
      });
      tagIds[item.tagName] = tagId;
    }
  }
};
