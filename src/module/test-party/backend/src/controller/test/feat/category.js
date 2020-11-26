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
          categoryLanguage: 'en-us',
          categoryName: 'levelOne',
          categoryIdParent: 0,
        },
      });
      assert(categoryId > 0);


      this.ctx.success();
    }

  }

  return CategoryController;

};
