/*
* @Author: zhennann
* @Date:   2017-09-28 23:35:15
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-29 00:30:38
*/

module.exports = () => {
  return function* transaction(next) {

    // set flag
    this.dbMeta.transaction = true;

    try {
      // next
      yield next;

      // commit
      if (this.dbMeta.master && this.dbMeta.connection) {
        const tran = this.dbMeta.connection;
        this.dbMeta.connection = null;
        yield tran.commit();
      }
    } catch (err) {
      if (this.dbMeta.master && this.dbMeta.connection) {
        const tran = this.dbMeta.connection;
        this.dbMeta.connection = null;
        yield tran.rollback();
        throw err;
      }
    }

  };
};
