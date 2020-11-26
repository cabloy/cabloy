const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  class TagController extends app.Controller {

    async tag() {

      // atomClass
      const atomClass = {
        module: 'test-party',
        atomClassName: 'party',
      };

      // add
      const tagId = await this.ctx.bean.tag.add({
        atomClass,
        data: {
          tagLanguage: 'en-us',
          tagName: 'tagOne',
        },
      });
      assert(tagId > 0);

      // parseTags: 'tagOne,tagTwo,tagThree'
      const tags = await this.ctx.bean.tag.parseTags({
        atomClass,
        tagLanguage: 'en-us',
        tagName: 'tagOne,tagTwo,tagThree',
        force: true,
      });
      assert.equal(tags.length, 3);


      this.ctx.success();
    }

  }

  return TagController;

};
