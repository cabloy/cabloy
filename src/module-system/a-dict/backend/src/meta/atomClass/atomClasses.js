const dict = require('./atomClass/dict.js');

module.exports = app => {
  const atomClasses = {
    //
    dict: dict(app),
  };
  return atomClasses;
};
