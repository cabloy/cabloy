const share = require('./model/share.js');
const shareRecordPV = require('./model/shareRecordPV.js');
const shareRecordUV = require('./model/shareRecordUV.js');

module.exports = app => {
  const models = {
    share,
    shareRecordPV,
    shareRecordUV,
  };
  return models;
};
