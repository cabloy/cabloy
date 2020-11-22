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
      let list = await model.select({
        where: { atomStaticKey },
      });
      assert.equal(list.length, 3);

      // read
      const item = await model.get({
        atomStaticKey,
        atomName: 'atom-one',
      });

      // update one row
      await model.update({
        id: item.id,
        readCount: item.readCount + 1,
      });

      // update with options.where and options.columns
      await model.update({
        readCount: 1,
      }, {
        where: { atomStaticKey },
        columns: [ 'readCount' ],
      });

      // select: in
      list = await model.select({
        where: { atomStaticKey: [ atomStaticKey ] },
      });
      assert.equal(list.length, 3);
      list = await model.select({
        where: {
          atomStaticKey: {
            op: 'in', val: [ atomStaticKey ],
          },
        },
      });
      assert.equal(list.length, 3);

      // select: is null
      list = await model.select({
        where: {
          atomStaticKey: [ atomStaticKey ],
          atomName: null,
        },
      });
      assert.equal(list.length, 0);

      // select: is not null
      list = await model.select({
        where: {
          atomStaticKey: [ atomStaticKey ],
          atomName: {
            op: 'notNull',
          },
        },
      });
      assert.equal(list.length, 3);

      // select: like
      list = await model.select({
        where: {
          atomStaticKey: [ atomStaticKey ],
          atomName: {
            op: 'likeRight',
            val: 'atom-',
          },
        },
      });
      assert.equal(list.length, 3);

      // select: or
      list = await model.select({
        where: {
          atomStaticKey: [ atomStaticKey ],
          __or__: [
            { atomName: 'atom-one' },
            { atomName: 'atom-two' },
          ],
        },
      });
      assert.equal(list.length, 2);


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
