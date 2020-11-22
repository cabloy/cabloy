const require3 = require('require3');
const assert = require3('assert');

module.exports = app => {

  const atomStaticKey = '--model--test--';
  const __rows = [
    { atomStaticKey, atomName: 'atom-one', atomStage: 0 },
    { atomStaticKey, atomName: 'atom-two', atomStage: 1 },
    { atomStaticKey, atomName: 'atom-three', atomStage: 2 },
  ];

  class ModelController extends app.Controller {

    async model() {

      // model
      const model = this.ctx.model.module('a-base').atom;

      // insert one row
      await model.insert(__rows[0]);
      // insert multi rows
      await model.insert(__rows.slice(1));

      // select
      const list = await model.select({
        where: { atomStaticKey },
      });
      assert.equal(list.length, 3);

      // delete
      await model.delete({ atomStaticKey });

      // count
      const count = await model.count({ atomStaticKey });
      assert.equal(count, 0);

      // done
      this.ctx.success();
    }

  }

  return ModelController;

};
