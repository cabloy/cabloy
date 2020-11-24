const set00_simple = require('./flowDef/set00_simple.js');
const set00_edgeSequence = require('./flowDef/set00_edgeSequence.js');
const set00_activityNone = require('./flowDef/set00_activityNone.js');
const set00_activityService = require('./flowDef/set00_activityService.js');
// const set00_startEventTimer = require('./flowDef/set00_startEventTimer.js');
const set01_startEventAtom = require('./flowDef/set01_startEventAtom.js');
const set01_atomUserTask = require('./flowDef/set01_atomUserTask.js');
const set01_atomAssigneesConfirmation = require('./flowDef/set01_atomAssigneesConfirmation.js');

module.exports = app => {
  const flowDefs = [
    set00_simple(app),
    set00_edgeSequence(app),
    set00_activityNone(app),
    set00_activityService(app),
    //  set00_startEventTimer(app),
    set01_startEventAtom(app),
    set01_atomUserTask(app),
    set01_atomAssigneesConfirmation(app),
  ];
  return flowDefs;
};
