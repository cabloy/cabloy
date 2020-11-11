const set00_simple = require('./definition/set00_simple.js');
const set00_edgeSequence = require('./definition/set00_edgeSequence.js');
const set00_activityNone = require('./definition/set00_activityNone.js');
const set00_activityService = require('./definition/set00_activityService.js');
// const set00_startEventTimer = require('./definition/set00_startEventTimer.js');
const set01_startEventAtom = require('./definition/set01_startEventAtom.js');
const set01_atomUserTask = require('./definition/set01_atomUserTask.js');
// const set01_atomAssigneesConfirmation = require('./definition/set01_atomAssigneesConfirmation.js');

module.exports = app => {
  const definitions = {
    set00_simple: set00_simple(app),
    set00_edgeSequence: set00_edgeSequence(app),
    set00_activityNone: set00_activityNone(app),
    set00_activityService: set00_activityService(app),
    // set00_startEventTimer: set00_startEventTimer(app),
    set01_startEventAtom: set01_startEventAtom(app),
    set01_atomUserTask: set01_atomUserTask(app),
    // set01_atomAssigneesConfirmation: set01_atomAssigneesConfirmation(app),
  };
  return definitions;
};
