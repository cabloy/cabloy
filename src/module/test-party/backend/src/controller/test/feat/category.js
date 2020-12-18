const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class CategoryController extends app.Controller {

    async category() {

      // atomClass
      const atomClass = {
        module: 'test-party',
        atomClassName: 'party',
      };

      // add
      const categoryId = await this.ctx.bean.category.add({
        atomClass,
        data: {
          language: 'en-us',
          categoryName: 'levelOne',
          categoryIdParent: 0,
        },
      });
      assert(categoryId > 0);

      // parseCategoryName: levelOne.levelTwo.levelThree
      const category = await this.ctx.bean.category.parseCategoryName({
        atomClass,
        language: 'en-us',
        categoryName: 'levelOne.levelTwo.levelThree',
        force: true,
      });
      assert.equal(category.categoryName, 'levelThree');

      // ok
      this.ctx.success();
    }

  }

  return CategoryController;

};
